'use server';
/**
 * @fileOverview An AI flow to generate SEO-friendly listing details for a yacht.
 *
 * - generateListingDetails - A function that creates a title and description.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateListingDetailsInputSchema,
  type GenerateListingDetailsInput,
  GenerateListingDetailsOutputSchema,
  type GenerateListingDetailsOutput,
} from '@/ai/schemas/listing-details-schemas';

export async function generateListingDetails(input: GenerateListingDetailsInput): Promise<GenerateListingDetailsOutput> {
  return generateListingDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateListingDetailsPrompt',
  input: {schema: GenerateListingDetailsInputSchema},
  output: {schema: GenerateListingDetailsOutputSchema},
  prompt: `You are an expert yacht broker and SEO specialist. Your task is to create a compelling and search-engine-optimized title and description for a yacht listing based on the details provided.

**Instructions:**
1.  **Title:** Create a clear, concise, and attractive title. It MUST include the year, make, model, and a call-to-action like "For Sale" or similar. Example: "Immaculate 2022 Beneteau Oceanis 46.1 For Sale".
2.  **Description:** Write a comprehensive and persuasive description in well-structured paragraphs.
    *   Start with a strong opening statement that grabs attention.
    *   Highlight the yacht's key selling points, condition, and type.
    *   Weave in the provided key features naturally.
    *   Mention the ideal usage (e.g., "perfect for blue-water cruising," "ideal for weekend getaways").
    *   Maintain a professional and luxurious tone.
    *   Naturally include keywords like "yacht for sale", "sailing yacht", "[make] [model] for sale", "[location] yacht".

**Yacht Details:**
-   **Year:** {{{year}}}
-   **Make/Builder:** {{{make}}}
-   **Model:** {{{model}}}
-   **Length:** {{{length}}} ft
-   **Condition:** {{{condition}}}
-   **Boat Type:** {{{boatType}}}
-   **Key Features:** {{#if keyFeatures}}{{#each keyFeatures}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}Not specified.{{/if}}

Generate the JSON output with the 'title' and 'description' fields.`,
});

const generateListingDetailsFlow = ai.defineFlow(
  {
    name: 'generateListingDetailsFlow',
    inputSchema: GenerateListingDetailsInputSchema,
    outputSchema: GenerateListingDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
