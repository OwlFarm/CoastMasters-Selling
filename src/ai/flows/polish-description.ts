
'use server';
/**
 * @fileOverview An AI flow to polish a yacht listing description.
 *
 * - polishDescription - A function that takes a raw description and refines it.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PolishDescriptionInputSchema = z.object({
  description: z.string().describe('The raw, user-written yacht description to be polished.'),
});
type PolishDescriptionInput = z.infer<typeof PolishDescriptionInputSchema>;

const PolishDescriptionOutputSchema = z.object({
    polishedDescription: z.string().describe('The improved, well-written, and persuasive yacht description in Markdown format.'),
});
type PolishDescriptionOutput = z.infer<typeof PolishDescriptionOutputSchema>;


export async function polishDescription(input: PolishDescriptionInput): Promise<string> {
    const result = await polishDescriptionFlow(input);
    return result.polishedDescription;
}

const prompt = ai.definePrompt({
  name: 'polishDescriptionPrompt',
  input: {schema: PolishDescriptionInputSchema},
  output: {schema: PolishDescriptionOutputSchema},
  prompt: `You are an expert copywriter and yacht broker. Your task is to take a user-provided yacht description and "polish" it.

Your goal is to make the description more compelling, professional, and persuasive to potential buyers.

**Instructions:**
1.  **Correct Grammar and Spelling:** Fix any grammatical errors, typos, or spelling mistakes.
2.  **Improve Flow and Readability:** Restructure sentences and paragraphs for better flow. Use clear and concise language.
3.  **Enhance Tone:** Elevate the language to sound more luxurious, professional, and appealing, befitting a high-end yacht marketplace.
4.  **Add Structure:** Use Markdown for formatting. Use paragraphs to separate ideas. Where appropriate, use bullet points for lists of features or specifications.
5.  **Preserve Key Information:** Do NOT invent new features or details. All the key information from the original description must be present in the polished version. You are editing, not creating from scratch.

**User's Raw Description:**
{{{description}}}

Now, provide the polished description in the \`polishedDescription\` field of the JSON output.`,
});

const polishDescriptionFlow = ai.defineFlow(
  {
    name: 'polishDescriptionFlow',
    inputSchema: PolishDescriptionInputSchema,
    outputSchema: PolishDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
