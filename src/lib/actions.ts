'use server';

import { smartSearch, type SmartSearchInput, type SmartSearchOutput } from '@/ai/flows/smart-search';
import { generateListingDetails, type GenerateListingDetailsOutput } from '@/ai/flows/generate-listing-details';
import { GenerateListingDetailsInputSchema } from '@/ai/schemas/listing-details-schemas';
import { z } from 'zod';
import { getFeaturedYachts } from '@/services/yacht-service';
import type { Yacht } from '@/lib/types';


const searchSchema = z.object({
  query: z.string().min(3, 'Search query must be at least 3 characters long.'),
});

type SearchState = {
  result?: string;
  error?: string;
};

export async function handleSmartSearch(
  prevState: SearchState,
  formData: FormData
): Promise<SearchState> {
  const validatedFields = searchSchema.safeParse({
    query: formData.get('query'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.query?.join(', '),
    };
  }
  
  const input: SmartSearchInput = { query: validatedFields.data.query };

  try {
    const output = await smartSearch(input);
    return { result: output.yachtRecommendations };
  } catch (error) {
    console.error('Smart search failed:', error);
    return { error: 'An error occurred during the search. Please try again.' };
  }
}

// State and action for the detailed filters on the yachts page.
export type FilteredSearchState = {
  result?: {
      yachts: Yacht[];
      message: string;
  };
  error?: string;
};

export async function handleFilteredSearch(
  prevState: FilteredSearchState,
  formData: FormData
): Promise<FilteredSearchState> {
  const getNumber = (name: string) => {
    const value = formData.get(name);
    if (value === null || value === '') return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  };

  const filters = {
    conditions: formData.getAll('conditions').map(String).filter(Boolean),
    listingTypes: formData.getAll('listingTypes').map(String).filter(Boolean),
    priceMin: getNumber('priceMin'),
    priceMax: getNumber('priceMax'),
    lengthMin: getNumber('lengthMin'),
    lengthMax: getNumber('lengthMax'),
    lengthUnit: (formData.get('lengthUnit') as 'ft' | 'm' | null) || 'ft',
    yearMin: getNumber('yearMin'),
    yearMax: getNumber('yearMax'),
    boatTypes: formData.getAll('boatTypes').map(String).filter(Boolean),
    usageStyles: formData.getAll('usageStyles').map(String).filter(Boolean),
    builders: formData.getAll('builders').map(String).filter(Boolean),
    hullMaterials: formData.getAll('hullMaterials').map(String).filter(Boolean),
    hullShapes: formData.getAll('hullShapes').map(String).filter(Boolean),
    keelTypes: formData.getAll('keelTypes').map(String).filter(Boolean),
    rudderTypes: formData.getAll('rudderTypes').map(String).filter(Boolean),
    propellerTypes: formData.getAll('propellerTypes').map(String).filter(Boolean),
    features: formData.getAll('features').map(String).filter(Boolean),
    deck: formData.getAll('deck').map(String).filter(Boolean),
    cabin: formData.getAll('cabin').map(String).filter(Boolean),
    fuelTypes: formData.getAll('fuelTypes').map(String).filter(Boolean),
    locations: formData.getAll('locations').map(String).filter(Boolean),
  };

  // This is a temporary solution for the prototype stage.
  // In a real app, this filtering would happen in the database query.
  try {
    const allYachts = await getFeaturedYachts();
    const filteredYachts = allYachts.filter(yacht => {
      // Price
      if (filters.priceMin !== undefined && yacht.price < filters.priceMin) return false;
      if (filters.priceMax !== undefined && yacht.price > filters.priceMax) return false;
      
      // Year
      if (filters.yearMin !== undefined && yacht.year < filters.yearMin) return false;
      if (filters.yearMax !== undefined && yacht.year > filters.yearMax) return false;

      // Length - for now, we assume all lengths are in feet and don't convert.
      if (filters.lengthMin !== undefined && yacht.length < filters.lengthMin) return false;
      if (filters.lengthMax !== undefined && yacht.length > filters.lengthMax) return false;

      // Array checks for string properties (case-insensitive)
      if (filters.conditions.length > 0 && !filters.conditions.some(c => c.toLowerCase() === yacht.condition.toLowerCase())) return false;
      if (filters.listingTypes.length > 0 && !filters.listingTypes.some(t => t.toLowerCase() === yacht.listingType.toLowerCase())) return false;
      if (filters.boatTypes.length > 0 && !filters.boatTypes.some(bt => bt.toLowerCase() === yacht.boatType.toLowerCase())) return false;
      if (filters.builders.length > 0 && !filters.builders.some(b => b.toLowerCase() === yacht.make.toLowerCase())) return false;

      // Array checks for ID properties
      if (filters.hullMaterials.length > 0 && yacht.hullMaterial && !filters.hullMaterials.includes(yacht.hullMaterial)) return false;
      if (filters.fuelTypes.length > 0 && yacht.fuelType && !filters.fuelTypes.includes(yacht.fuelType)) return false;
      if (filters.locations.length > 0 && yacht.locationId && !filters.locations.includes(yacht.locationId)) return false;

      // Check for feature intersection (yacht must have ALL selected features)
      const allYachtFeatures = [
          ...(yacht.usageStyles || []), ...(yacht.features || []), ...(yacht.deck || []), ...(yacht.cabin || [])
      ];
      const allFilterFeatures = [
          ...filters.usageStyles, ...filters.features, ...filters.deck, ...filters.cabin
      ];
      if (allFilterFeatures.length > 0 && !allFilterFeatures.every(f => allYachtFeatures.includes(f))) return false;

      return true;
    });

    const message = `Showing ${filteredYachts.length} matching yachts.`;
    return { result: { yachts: filteredYachts, message } };

  } catch (error) {
    console.error('Filtered search failed:', error);
    return { error: 'An error occurred during the search. Please try again.' };
  }
}

// AI Action for the Sell Form
type GenerateDetailsState = {
  result?: GenerateListingDetailsOutput;
  error?: string;
}

export async function handleGenerateListingDetails(
  prevState: GenerateDetailsState,
  formData: FormData
): Promise<GenerateDetailsState> {
   const validatedFields = GenerateListingDetailsInputSchema.safeParse({
    make: formData.get('make'),
    model: formData.get('model'),
    year: Number(formData.get('year')),
    length: Number(formData.get('length')),
    condition: formData.get('condition'),
    boatType: formData.get('boatType'),
    features: formData.getAll('features').map(String),
  });

  if (!validatedFields.success) {
    return {
      error: 'Missing required details to generate listing. Please fill out the yacht details first.',
    };
  }

  try {
    const output = await generateListingDetails(validatedFields.data);
    return { result: output };
  } catch (error) {
    console.error('Generate details failed:', error);
    return { error: 'An error occurred while generating details. Please try again.' };
  }
}
