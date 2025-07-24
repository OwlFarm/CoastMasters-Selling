
'use server';

import { smartSearch, type SmartSearchInput, type SmartSearchOutput } from '@/ai/flows/smart-search';
import { generateListingDetails, type GenerateListingDetailsOutput } from '@/ai/flows/generate-listing-details';
import { polishDescription } from '@/ai/flows/polish-description';
import { GenerateListingDetailsInputSchema } from '@/ai/schemas/listing-details-schemas';
import { z } from 'zod';
import type { Yacht } from '@/lib/types';
import { searchYachts, type PiloterrSearchQuery } from '@/services/piloterr-service';


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

export async function handleFilteredSearch(
  prevState: FilteredSearchState,
  formData: FormData
): Promise<FilteredSearchState> {
  
  const query: PiloterrSearchQuery = {
    // We can add a query if we have a search bar for it.
    // For now, let's search for "sailboat" to get relevant results.
    query: 'sailboat', 
    min_price: getNumber(formData.get('priceMin')),
    max_price: getNumber(formData.get('priceMax')),
    min_year: getNumber(formData.get('yearMin')),
    max_year: getNumber(formData.get('yearMax')),
    min_length: getNumber(formData.get('lengthMin')),
    max_length: getNumber(formData.get('lengthMax')),
    currency: formData.get('currency')?.toString().toUpperCase(),
  };

  console.log('Constructed filter query for Piloterr API:', query);

  try {
    const yachts = await searchYachts(query);
    
    // The Piloterr API does the filtering, so we just display the results.
    // We can add client-side filtering here later if needed for unsupported params.
    
    if (yachts.length > 0) {
        const message = `Showing ${yachts.length} matching yachts.`;
        return { result: { yachts, message } };
    }

    const message = 'No matching yachts found. Try broadening your search filters.';
    return { result: { yachts: [], message } };

  } catch (error) {
    console.error('Filtered search failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { error: `An error occurred during the search: ${errorMessage}` };
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
