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

// Input schema reflecting all the filters from YachtFilters.tsx
const SmartSearchInputSchema = z.object({
  query: z.string().optional().describe('The natural language query to search for yachts.'),
  conditions: z.array(z.string()).optional().describe('Selected conditions (e.g., new, used).'),
  priceMin: z.number().optional().describe('Minimum price.'),
  priceMax: z.number().optional().describe('Maximum price.'),
  lengthMin: z.number().optional().describe('Minimum length.'),
  lengthMax: z.number().optional().describe('Maximum length.'),
  lengthUnit: z.enum(['ft', 'm']).optional().describe('Unit for length.'),
  yearMin: z.number().optional().describe('Minimum manufacturing year.'),
  yearMax: z.number().optional().describe('Maximum manufacturing year.'),
  boatTypes: z.array(z.string()).optional().describe('Selected boat types.'),
  usageStyles: z.array(z.string()).optional().describe('Selected usage styles (e.g., ocean, coast).'),
  builders: z.array(z.string()).optional().describe('Selected builders.'),
  locations: z.array(z.string()).optional().describe('Selected locations.'),
  fuelTypes: z.array(z.string()).optional().describe('Selected fuel types.'),
  hullMaterials: z.array(z.string()).optional().describe('Selected hull materials.'),
  hullShapes: z.array(z.string()).optional().describe('Selected hull shapes.'),
  keelTypes: z.array(z.string()).optional().describe('Selected keel types.'),
  rudderTypes: z.array(z.string()).optional().describe('Selected rudder types.'),
  propellerTypes: z.array(z.string()).optional().describe('Selected propeller types.'),
  features: z.array(z.string()).optional().describe('Selected features and equipment.'),
  deck: z.array(z.string()).optional().describe('Selected deck features.'),
  belowDeck: z.array(z.string()).optional().describe('Selected below deck features.'),
});
export type SmartSearchInput = z.infer<typeof SmartSearchInputSchema>;

const SmartSearchOutputSchema = z.object({
  hasExactResults: z.boolean().describe('Whether exact results matching all criteria were found.'),
  yachtRecommendations: z
    .string()
    .describe('A list of yacht recommendations. This can be an empty string if nothing is found.'),
  explanation: z
    .string()
    .optional()
    .describe(
      'An explanation of which criteria were relaxed if no exact matches were found. For example, "No exact matches were found. Broadening price range to include..."'
    ),
});
export type SmartSearchOutput = z.infer<typeof SmartSearchOutputSchema>;

export async function smartSearch(input: SmartSearchInput): Promise<SmartSearchOutput> {
  return smartSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSearchPrompt',
  input: {schema: SmartSearchInputSchema},
  output: {schema: SmartSearchOutputSchema},
  prompt: `You are an expert yacht broker specializing in helping users find the perfect yacht.
The user has provided a search query and/or a set of filters.

Your primary goal is to find yachts that perfectly match ALL the user's criteria.
If you find yachts that are an exact match, list them under 'yachtRecommendations', set 'hasExactResults' to true, and leave the 'explanation' field blank.

**If you cannot find any yachts that match all the specified criteria**, you must then find the CLOSEST possible matches by relaxing ONE or TWO criteria.
When you do this, you MUST:
1. Set 'hasExactResults' to false.
2. Populate the 'explanation' field to clearly state which specific criteria you relaxed to find the results. For example: "No exact matches were found. I have expanded the price range to find these similar options." or "No yachts were available in Monaco. Here are some options in nearby locations in the Mediterranean."
3. List the closest matching yachts you found in the 'yachtRecommendations' field.

If, after relaxing criteria, you still cannot find any relevant yachts, return an empty 'yachtRecommendations' list, set 'hasExactResults' to false, and provide an explanation saying no close matches could be found.

Here are the user's search criteria. A field not provided means the user has no preference for it.
- Natural Language Query: {{{query}}}
- Condition: {{#if conditions}}{{#each conditions}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
- Price Range: {{#if priceMin}}{{priceMin}}{{else}}any{{/if}} - {{#if priceMax}}{{priceMax}}{{else}}any{{/if}} USD
- Length Range: {{#if lengthMin}}{{lengthMin}}{{else}}any{{/if}} - {{#if lengthMax}}{{lengthMax}}{{else}}any{{/if}} {{#if lengthUnit}}{{lengthUnit}}{{/if}}
- Year Range: {{#if yearMin}}{{yearMin}}{{else}}any{{/if}} - {{#if yearMax}}{{yearMax}}{{else}}any{{/if}}
- Boat Types: {{#if boatTypes}}{{#each boatTypes}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
- Usage Styles: {{#if usageStyles}}{{#each usageStyles}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
- Builders: {{#if builders}}{{#each builders}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
- Locations: {{#if locations}}{{#each locations}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
- Fuel Types: {{#if fuelTypes}}{{#each fuelTypes}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
- Hull Materials: {{#if hullMaterials}}{{#each hullMaterials}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
- Hull Shape: {{#if hullShapes}}{{#each hullShapes}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
- Keel Type: {{#if keelTypes}}{{#each keelTypes}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
- Rudder Type: {{#if rudderTypes}}{{#each rudderTypes}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
- Propeller Type: {{#if propellerTypes}}{{#each propellerTypes}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
- Features: {{#if features}}{{#each features}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
- Deck Features: {{#if deck}}{{#each deck}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
- Below Deck Features: {{#if belowDeck}}{{#each belowDeck}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}

Provide your response in the specified JSON format.`,
});

const smartSearchFlow = ai.defineFlow(
  {
    name: 'smartSearchFlow',
    inputSchema: SmartSearchInputSchema,
    outputSchema: SmartSearchOutputSchema,
  },
  async input => {
    // Filter out empty arrays from the input object so the prompt is cleaner.
    const cleanInput = Object.entries(input).reduce((acc, [key, value]) => {
        if (Array.isArray(value) && value.length === 0) {
            return acc;
        }
        (acc as any)[key as keyof SmartSearchInput] = value;
        return acc;
    }, {} as Partial<SmartSearchInput>);

    const {output} = await prompt(cleanInput);
    return output!;
  }
);
