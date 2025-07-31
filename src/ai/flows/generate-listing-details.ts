
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
import {
  divisions,
  hullMaterialOptions,
  transomShapeOptions,
  keelTypeOptions,
  rudderTypeOptions,
  propellerTypeOptions,
  fuelTypes,
  featureOptions,
  deckOptions,
  cabinFeatureOptions,
  saloonOptions,
  galleyOptions,
  headsOptions,
} from '@/lib/data';
import { genkit } from 'genkit';

export async function generateListingDetails(input: GenerateListingDetailsInput): Promise<GenerateListingDetailsOutput> {
  return generateListingDetailsFlow(input);
}

// Helper to format options for the prompt
const formatOptionsForPrompt = (options: {id: string; label: string}[]) =>
  options.map(o => `- id: ${o.id}, label: ${o.label}`).join('\n');


const prompt = ai.definePrompt({
  name: 'generateListingDetailsPrompt',
  input: {schema: GenerateListingDetailsInputSchema},
  output: {schema: GenerateListingDetailsOutputSchema},
  prompt: `You are an expert yacht broker and SEO specialist.

**Task 1: Generate Title & Description**
Your primary task is to create a compelling and search-engine-optimized title and description for a yacht listing based on the details provided.

*   **Title:** Create a clear, concise, and attractive title. It MUST include the year, make, model, and a call-to-action like "For Sale". Example: "Immaculate 2022 Beneteau Oceanis 46.1 For Sale".
*   **Description:** Write a comprehensive and persuasive description in well-structured paragraphs.
    *   Start with a strong opening statement.
    *   Highlight the yacht's key selling points, condition, and type.
    *   Weave in the provided key features naturally.
    *   Mention the ideal usage (e.g., "perfect for off-shore cruising," "ideal for weekend getaways").
    *   Maintain a professional and luxurious tone.

**Yacht Details:**
-   **Year:** {{{year}}}
-   **Make/Builder:** {{{make}}}
-   **Model:** {{{model}}}
-   **Length:** {{{length}}} ft
-   **Condition:** {{{condition}}}
-   **Boat Type:** {{{boatType}}}
-   **User-Selected Features:** {{#if features}}{{#each features}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}Not specified.{{/if}}

---

**Task 2: Feature & Specification Detection**
After generating the title and description, analyze ALL the provided "Yacht Details" and the description you just wrote.
Based on this analysis, identify all applicable features and specifications from the lists below.
Return ONLY the \`id\` for each matching item in the corresponding output field (e.g., \`detectedFeatures\`, \`detectedHullMaterial\`).
For single-choice categories (like Hull Material), return only the one most likely ID as a string. For multi-choice categories (like Features), return an array of all matching IDs.

**Available Divisions:**
{{{divisions}}}

**Available Hull Materials:**
{{{hullMaterialOptions}}}

**Available Transom Shapes:**
{{{transomShapeOptions}}}

**Available Keel Types:**
{{{keelTypeOptions}}}

**Available Rudder Types:**
{{{rudderTypeOptions}}}

**Available Propeller Types:**
{{{propellerTypeOptions}}}

**Available Fuel Types:**
{{{fuelTypes}}}

**Available General Features:**
{{{featureOptions}}}

**Available Deck Features:**
{{{deckOptions}}}

**Available Cabin Features:**
{{{cabinFeatureOptions}}}

**Available Saloon Features:**
{{{saloonOptions}}}

**Available Galley Features:**
{{{galleyOptions}}}

**Available Heads Features:**
{{{headsOptions}}}

Generate the final JSON output with all fields: \`title\`, \`description\`, and all \`detected...\` fields.`,
});

const generateListingDetailsFlow = ai.defineFlow(
  {
    name: 'generateListingDetailsFlow',
    inputSchema: GenerateListingDetailsInputSchema,
    outputSchema: GenerateListingDetailsOutputSchema,
  },
  async input => {
     // The AI needs to know the possible options to choose from. We'll pass them in here.
    const promptData = {
      ...input,
      divisions: formatOptionsForPrompt(divisions),
      hullMaterialOptions: formatOptionsForPrompt(hullMaterialOptions),
      transomShapeOptions: formatOptionsForPrompt(transomShapeOptions),
      keelTypeOptions: formatOptionsForPrompt(keelTypeOptions),
      rudderTypeOptions: formatOptionsForPrompt(rudderTypeOptions),
      propellerTypeOptions: formatOptionsForPrompt(propellerTypeOptions),
      fuelTypes: formatOptionsForPrompt(fuelTypes),
      featureOptions: formatOptionsForPrompt(featureOptions),
      deckOptions: formatOptionsForPrompt(deckOptions),
      cabinFeatureOptions: formatOptionsForPrompt(cabinFeatureOptions),
      saloonOptions: formatOptionsForPrompt(saloonOptions),
      galleyOptions: formatOptionsForPrompt(galleyOptions),
      headsOptions: formatOptionsForPrompt(headsOptions),
    };

    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      attempt++;
      try {
        const {output} = await prompt(promptData as any);
        if (output) {
          return output; // Success
        }
        console.warn(`Attempt ${attempt}: AI returned null output.`);
      } catch (error) {
        console.error(`Attempt ${attempt} failed with error:`, error);
      }
    }

    // If all attempts fail, throw a user-friendly error.
    throw new Error('The AI failed to generate listing details after multiple attempts. Please try again later or fill in the details manually.');
  }
);
