
'use server';
/**
 * @fileOverview An AI flow to pre-populate a new yacht listing from a known model.
 *
 * - populateListingFromModel - A function that fetches model specs and generates a title/description.
 * - PopulateListingInput - The input type for the flow.
 * - PopulateListingOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getYachtModelSpecs, type YachtModelSpecification } from '@/services/yacht-model-service';
import { hullMaterialOptions, keelTypeOptions, rudderTypeOptions } from '@/lib/data';

export const PopulateListingInputSchema = z.object({
  modelName: z.string().describe('The name of the yacht model to look up (e.g., "Najad 460").'),
});
export type PopulateListingInput = z.infer<typeof PopulateListingInputSchema>;

export const PopulateListingOutputSchema = z.object({
  title: z.string().describe('A compelling, SEO-friendly title for the yacht listing.'),
  description: z.string().describe('A detailed and engaging description of the yacht, written in well-structured paragraphs.'),
  make: z.string().describe('The builder/manufacturer of the yacht.'),
  model: z.string().describe('The model of the yacht.'),
  length: z.number().describe('The length of the yacht in feet.'),
  hullMaterial: z.string().optional().describe('The ID of the detected hull material (e.g., "fiberglass").'),
  keelType: z.string().optional().describe('The ID of the detected keel type (e.g., "fin").'),
  rudderType: z.string().optional().describe('The ID of the detected rudder type (e.g., "spade").'),
  otherSpecifications: z.string().describe('A formatted string containing other key specifications not in the main fields.'),
});
export type PopulateListingOutput = z.infer<typeof PopulateListingOutputSchema>;

// This is the function that will be called from the frontend.
export async function populateListingFromModel(input: PopulateListingInput): Promise<PopulateListingOutput | { error: string }> {
    const specs = await getYachtModelSpecs(input.modelName);

    if (!specs) {
        return { error: `Specifications for model "${input.modelName}" not found.` };
    }

    return populateListingFlow(specs);
}

const prompt = ai.definePrompt({
  name: 'populateListingPrompt',
  input: {schema: z.custom<YachtModelSpecification>()},
  output: {schema: PopulateListingOutputSchema },
  prompt: `You are an expert yacht broker and SEO specialist.
Your task is to use the provided yacht specifications to generate a compelling new listing.

**Instructions:**
1.  **Generate Title:** Create a clear, concise, and attractive title. It MUST include the builder, model, and a call-to-action like "For Sale" or "Ready to Sail". Example: "Proven Offshore Cruiser: Najad 460 For Sale".
2.  **Generate Description:** Write a comprehensive and persuasive description in well-structured paragraphs.
    *   Start with a strong opening statement highlighting the yacht's reputation (e.g., "Designed by the renowned Judel/Vrolijk...").
    *   Detail the key features like the rigging, hull design, and accommodation layout.
    *   Mention its ideal usage (e.g., "perfect for blue-water cruising," "a comfortable and safe passage-maker").
    *   Maintain a professional, knowledgeable, and luxurious tone.
3.  **Extract Key Details:**
    *   From the specifications, identify and return the make, model, and LOA (length).
    *   Analyze the specs to determine the most likely ID for 'hullMaterial', 'keelType', and 'rudderType' from the provided options.
4.  **Format Other Specs:** Combine the remaining important specifications (like LWL, Beam, Displacement, Ballast, Engine, etc.) into a single, well-formatted string for the 'otherSpecifications' field. Use clear labels for each spec.

**Yacht Specifications:**
- Model: {{{model}}}
- Hull Type: {{{hullType}}}
- Rudder Type: {{{rudderType}}}
- Rigging Type: {{{riggingType}}}
- LOA: {{{loa}}} ft
- LWL: {{{lwl}}} ft
- S.A. (reported): {{{saReported}}} sq ft
- Beam: {{{beam}}} ft
- Displacement: {{{displacement}}} lb
- Ballast: {{{ballast}}} lb
- Max Draft: {{{maxDraft}}} ft
- Construction: {{{construction}}}
- First Built: {{{firstBuilt}}}
- Builder: {{{builder}}}
- Designer: {{{designer}}}
- Auxiliary Power: {{auxiliaryPower.make}} {{auxiliaryPower.model}} ({{auxiliaryPower.hp}} HP Diesel)
- Fuel Capacity: {{{tanks.fuel}}} gals
- Water Capacity: {{{tanks.water}}} gals
- Accommodations: Sleeps {{{accommodations.sleeps}}}, {{{accommodations.heads}}} heads, {{{accommodations.headroom}}} ft headroom
- Mast Height: {{{mastHeightFromDWL}}} ft

**Available Options for Detection:**
- Hull Materials: ${hullMaterialOptions.map(o => `id: ${o.id}, label: ${o.label}`).join('; ')}
- Keel Types: ${keelTypeOptions.map(o => `id: ${o.id}, label: ${o.label}`).join('; ')}
- Rudder Types: ${rudderTypeOptions.map(o => `id: ${o.id}, label: ${o.label}`).join('; ')}

Now, generate the final JSON output with all the required fields.`,
});

const populateListingFlow = ai.defineFlow(
  {
    name: 'populateListingFlow',
    inputSchema: z.custom<YachtModelSpecification>(),
    outputSchema: PopulateListingOutputSchema,
  },
  async (specs) => {
    const {output} = await prompt(specs);
    return output!;
  }
);
