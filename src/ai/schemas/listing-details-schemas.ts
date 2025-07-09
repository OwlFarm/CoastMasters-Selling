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
  features: z.array(z.string()).optional().describe('A list of key features or equipment.'),
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
