
'use server';

import { smartSearch, type SmartSearchInput, type SmartSearchOutput } from '@/ai/flows/smart-search';
import { generateListingDetails, type GenerateListingDetailsOutput } from '@/ai/flows/generate-listing-details';
import { polishDescription } from '@/ai/flows/polish-description';
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

const getNumber = (value: FormDataEntryValue | null) => {
    if (value === null || value === '') return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
};

type Filters = {
    conditions: string[];
    listingTypes: string[];
    priceMin?: number;
    priceMax?: number;
    lengthMin?: number;
    lengthMax?: number;
    lengthUnit: 'ft' | 'm';
    yearMin?: number;
    yearMax?: number;
    boatTypes: string[];
    divisions: string[];
    builders: string[];
    hullMaterials: string[];
    hullShapes: string[];
    keelTypes: string[];
    rudderTypes: string[];
    propellerTypes: string[];
    sailRiggings: string[];
    features: string[];
    deck: string[];
    cabin: string[];
    fuelTypes: string[];
    locations: string[];
};

function applyFilters(yachts: Yacht[], f: Filters): Yacht[] {
    return yachts.filter(yacht => {
        if (f.priceMin !== undefined && yacht.price < f.priceMin) return false;
        if (f.priceMax !== undefined && yacht.price > f.priceMax) return false;
        if (f.yearMin !== undefined && yacht.year < f.yearMin) return false;
        if (f.yearMax !== undefined && yacht.year > f.yearMax) return false;
        if (f.lengthMin !== undefined && yacht.length < f.lengthMin) return false;
        if (f.lengthMax !== undefined && yacht.length > f.lengthMax) return false;
        if (f.conditions.length > 0 && !f.conditions.some(c => c.toLowerCase() === yacht.condition.toLowerCase())) return false;
        if (f.listingTypes.length > 0 && !f.listingTypes.some(t => t.toLowerCase() === yacht.listingType.toLowerCase())) return false;
        if (f.boatTypes.length > 0 && !f.boatTypes.some(bt => bt.toLowerCase() === yacht.boatType.toLowerCase())) return false;
        if (f.builders.length > 0 && !f.builders.some(b => b.toLowerCase() === yacht.make.toLowerCase())) return false;
        if (f.hullMaterials.length > 0 && yacht.hullMaterial && !f.hullMaterials.includes(yacht.hullMaterial)) return false;
        if (f.fuelTypes.length > 0 && yacht.fuelType && !f.fuelTypes.includes(yacht.fuelType)) return false;
        if (f.locations.length > 0 && yacht.locationId && !f.locations.includes(yacht.locationId)) return false;
        if (f.sailRiggings.length > 0 && yacht.sailRigging && !f.sailRiggings.includes(yacht.sailRigging)) return false;


        const allYachtFeatures = [
            ...(yacht.divisions || []), ...(yacht.features || []), ...(yacht.deck || []), ...(yacht.cabin || [])
        ];
        const allFilterFeatures = [
            ...f.divisions, ...f.features, ...f.deck, ...f.cabin
        ];
        if (allFilterFeatures.length > 0 && !allFilterFeatures.every(feat => allYachtFeatures.includes(feat))) return false;

        return true;
    });
}

export async function handleFilteredSearch(
  prevState: FilteredSearchState,
  formData: FormData
): Promise<FilteredSearchState> {
  
  const filters: Filters = {
    conditions: formData.getAll('conditions').map(String).filter(Boolean),
    listingTypes: formData.getAll('listingTypes').map(String).filter(Boolean),
    priceMin: getNumber(formData.get('priceMin')),
    priceMax: getNumber(formData.get('priceMax')),
    lengthMin: getNumber(formData.get('lengthMin')),
    lengthMax: getNumber(formData.get('lengthMax')),
    lengthUnit: (formData.get('lengthUnit') as 'ft' | 'm' | null) || 'ft',
    yearMin: getNumber(formData.get('yearMin')),
    yearMax: getNumber(formData.get('yearMax')),
    boatTypes: formData.getAll('boatTypes').map(String).filter(Boolean),
    divisions: formData.getAll('divisions').map(String).filter(Boolean),
    builders: formData.getAll('builders').map(String).filter(Boolean),
    hullMaterials: formData.getAll('hullMaterials').map(String).filter(Boolean),
    hullShapes: formData.getAll('hullShapes').map(String).filter(Boolean),
    keelTypes: formData.getAll('keelTypes').map(String).filter(Boolean),
    rudderTypes: formData.getAll('rudderTypes').map(String).filter(Boolean),
    propellerTypes: formData.getAll('propellerTypes').map(String).filter(Boolean),
    sailRiggings: formData.getAll('sailRiggings').map(String).filter(Boolean),
    features: formData.getAll('features').map(String).filter(Boolean),
    deck: formData.getAll('deck').map(String).filter(Boolean),
    cabin: formData.getAll('cabin').map(String).filter(Boolean),
    fuelTypes: formData.getAll('fuelTypes').map(String).filter(Boolean),
    locations: formData.getAll('locations').map(String).filter(Boolean),
  };

  try {
    const allYachts = await getFeaturedYachts();
    
    let filteredYachts = applyFilters(allYachts, filters);
    
    if (filteredYachts.length > 0) {
        const message = `Showing ${filteredYachts.length} matching yachts.`;
        return { result: { yachts: filteredYachts, message } };
    }

    const hasPriceFilter = filters.priceMin !== undefined || filters.priceMax !== undefined;
    const hasLocationFilter = filters.locations.length > 0;
    
    if (hasPriceFilter || hasLocationFilter) {
        const relaxedFilters = { ...filters, priceMin: undefined, priceMax: undefined, locations: [] };
        const relaxedYachts = applyFilters(allYachts, relaxedFilters);

        if (relaxedYachts.length > 0) {
            let relaxedCriteria: string[] = [];
            if (hasPriceFilter) relaxedCriteria.push('price');
            if (hasLocationFilter) relaxedCriteria.push('location');
            
            const message = `No exact matches. Showing ${relaxedYachts.length} comparable yachts by expanding ${relaxedCriteria.join(' and ')}.`;
            return { result: { yachts: relaxedYachts, message } };
        }
    }

    const message = 'No matching yachts found. Try broadening your search filters.';
    return { result: { yachts: [], message } };

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

// AI Action to Polish Description
const polishDescriptionSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
});

type PolishDescriptionState = {
  result?: string;
  error?: string;
};

export async function handlePolishDescription(
  prevState: PolishDescriptionState,
  formData: FormData
): Promise<PolishDescriptionState> {
  const validatedFields = polishDescriptionSchema.safeParse({
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Description is too short to polish.',
    };
  }

  try {
    const polishedText = await polishDescription(validatedFields.data);
    return { result: polishedText };
  } catch (error) {
    console.error('Polish description failed:', error);
    return { error: 'An error occurred while polishing the description. Please try again.' };
  }
}

    