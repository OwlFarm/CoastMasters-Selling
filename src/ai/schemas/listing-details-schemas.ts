
/**
 * @fileOverview Zod schemas and TypeScript types for the yacht listing details generation flow.
 *
 * - GenerateListingDetailsInputSchema - Zod schema for the input.
 * - GenerateListingDetailsInput - TypeScript type for the input.
 * - GenerateListingDetailsOutputSchema - Zod schema for the output.
 * - GenerateListingDetailsOutput - TypeScript type for the output.
 */

import {z} from 'zod';

export const GenerateListingDetailsInputSchema = z.object({
  make: z.string().describe('The builder/manufacturer of the yacht.'),
  model: z.string().describe('The model of the yacht.'),
  year: z.number().describe('The manufacturing year of the yacht.'),
  length: z.number().describe('The length of the yacht in feet.'),
  condition: z.string().describe('The condition of the yacht (e.g., new, used).'),
  boatType: z.string().describe('The type of boat (e.g., Motor, Sailing, Catamaran).'),
  features: z.array(z.string()).optional().describe('A list of key features or equipment already selected by the user.'),
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
  detectedDivisions: z.array(z.string()).optional().describe('An array of division IDs detected from the yacht details (e.g., ["blue-water", "island"]).'),
  detectedHullMaterial: z.string().optional().describe('The hull material ID detected from the yacht details (e.g., "fiberglass").'),
  detectedHullShape: z.string().optional().describe('The hull shape ID detected from the yacht details (e.g., "displacement").'),
  detectedKeelType: z.string().optional().describe('The keel type ID detected from the yacht details (e.g., "fin").'),
  detectedRudderType: z.string().optional().describe('The rudder type ID detected from the yacht details (e.g., "spade").'),
  detectedPropellerType: z.string().optional().describe('The propeller type ID detected from the yacht details (e.g., "folding").'),
  detectedFuelType: z.string().optional().describe('The fuel type ID detected from the yacht details (e.g., "diesel").'),
  detectedFeatures: z.array(z.string()).optional().describe('An array of general feature IDs detected from the yacht details (e.g., ["gps", "autopilot"]).'),
  detectedDeck: z.array(z.string()).optional().describe('An array of deck feature IDs detected from the yacht details (e.g., ["teak-deck", "bimini"]).'),
  detectedCabins: z.array(z.string()).optional().describe('An array of cabin feature IDs detected from the yacht details.'),
  detectedSaloon: z.array(z.string()).optional().describe('An array of saloon feature IDs detected from the yacht details.'),
  detectedGalley: z.array(z.string()).optional().describe('An array of galley feature IDs detected from the yacht details.'),
  detectedHeads: z.array(z.string()).optional().describe('An array of heads feature IDs detected from the yacht details.'),
});
export type GenerateListingDetailsOutput = z.infer<typeof GenerateListingDetailsOutputSchema>;

    