'use server';

/**
 * @fileOverview Smart search flow for yacht marketplace.
 *
 * - smartSearch - A function that handles the smart search process.
 * - SmartSearchInput - The input type for the smartSearch function.
 * - SmartSearchOutput - The return type for the smartSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSearchInputSchema = z.object({
  query: z.string().describe('The natural language query to search for yachts.'),
});
export type SmartSearchInput = z.infer<typeof SmartSearchInputSchema>;

const SmartSearchOutputSchema = z.object({
  yachtRecommendations: z
    .string()
    .describe('A list of yacht recommendations based on the search query.'),
});
export type SmartSearchOutput = z.infer<typeof SmartSearchOutputSchema>;

export async function smartSearch(input: SmartSearchInput): Promise<SmartSearchOutput> {
  return smartSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSearchPrompt',
  input: {schema: SmartSearchInputSchema},
  output: {schema: SmartSearchOutputSchema},
  prompt: `You are an expert yacht broker specializing in helping users find the perfect yacht. Based on the user's query, provide a list of yacht recommendations that meet their needs. Please take into account boat type, length, year, condition, location, price range and any other specifications provided in the user query.

User Query: {{{query}}}

Yacht Recommendations:`,
});

const smartSearchFlow = ai.defineFlow(
  {
    name: 'smartSearchFlow',
    inputSchema: SmartSearchInputSchema,
    outputSchema: SmartSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
