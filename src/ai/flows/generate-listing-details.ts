'use server';
/**
 * @fileOverview An AI flow to generate SEO-friendly listing details for a yacht.
 *
 * - generateListingDetails - A function that creates a title and description.
 * - GenerateListingDetailsInput - The input type.
 * - GenerateListingDetailsOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateListingDetailsInputSchema = z.object({
  make: z.string().describe('The builder/manufacturer of the yacht.'),
  model: z.string().describe('The model of the yacht.'),
  year: z.number().describe('The manufacturing year of the yacht.'),
  length: z.number().describe('The length of the yacht in feet.'),
  condition: z.string().describe('The condition of the yacht (e.g., new, used).'),
  boatType: z.string().describe('The type of boat (e.g., Motor, Sailing, Catamaran).'),
  keyFeatures: z.array(z.string()).optional().describe('A list of key features or equipment.'),
});
export type GenerateListingDetailsInput = z.infer<typeof GenerateListingDetailsInputSchema>;

export const GenerateListingDetailsOutputSchema = z.object({
  title: z
    .string()
    .describe('A compelling, SEO-friendly title for the yacht listing. Should include year, make, model, and be phrased like "For Sale: 2022 Beneteau Oceanis 46.1".'),
  description: z
    .string()
    .describe(
      'A detailed, engaging, and SEO-optimized description of the yacht. It should be written in paragraph form, highlighting the key features, condition, and ideal use cases. It should naturally incorporate keywords that potential buyers would search for.'
    ),
});
export type GenerateListingDetailsOutput = z.infer<typeof GenerateListingDetailsOutputSchema>;

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
