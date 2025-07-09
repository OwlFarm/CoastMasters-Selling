'use server';

import { smartSearch, type SmartSearchInput, type SmartSearchOutput } from '@/ai/flows/smart-search';
import { generateListingDetails, GenerateListingDetailsInputSchema, type GenerateListingDetailsOutput } from '@/ai/flows/generate-listing-details';
import { z } from 'zod';

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
    // This action is for the simple hero search, which doesn't have the "explanation" UI.
    // We'll just return the recommendations text.
    return { result: output.yachtRecommendations };
  } catch (error) {
    console.error('Smart search failed:', error);
    return { error: 'An error occurred during the search. Please try again.' };
  }
}

// New state and action for the detailed filters on the yachts page.
export type FilteredSearchState = {
  result?: SmartSearchOutput; // The whole output object from the AI
  error?: string;
};

export async function handleFilteredSearch(
  prevState: FilteredSearchState,
  formData: FormData
): Promise<FilteredSearchState> {
  // Helper to get number or undefined
  const getNumber = (name: string) => {
    const value = formData.get(name);
    if (value === null || value === '') return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  };
  
  const input: SmartSearchInput = {
    conditions: formData.getAll('conditions').map(String).filter(Boolean),
    listingTypes: formData.getAll('listingTypes').map(String).filter(Boolean),
    priceMin: getNumber('priceMin'),
    priceMax: getNumber('priceMax'),
    lengthMin: getNumber('lengthMin'),
    lengthMax: getNumber('lengthMax'),
    lengthUnit: (formData.get('lengthUnit') as 'ft' | 'm' | null) || undefined,
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

  try {
    const output = await smartSearch(input);
    return { result: output };
  } catch (error) {
    console.error('Filtered search failed:', error);
    return { error: 'An error occurred during the search. Please try again.' };
  }
}

// New AI Action for the Sell Form
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
    keyFeatures: formData.getAll('keyFeatures').map(String),
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
