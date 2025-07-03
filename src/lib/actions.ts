'use server';

import { smartSearch, type SmartSearchInput } from '@/ai/flows/smart-search';
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
    return { result: output.yachtRecommendations };
  } catch (error) {
    console.error('Smart search failed:', error);
    return { error: 'An error occurred during the search. Please try again.' };
  }
}
