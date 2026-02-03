'use server';

/**
 * @fileOverview AI-powered smart home suggestions flow.
 *
 * This file defines a Genkit flow that provides smart suggestions for optimizing home energy consumption
 * based on user behavior and preferences.
 *
 * @exports smartHomeSuggestions - The main function to generate smart home suggestions.
 * @exports SmartHomeSuggestionsInput - The input type for the smartHomeSuggestions function.
 * @exports SmartHomeSuggestionsOutput - The output type for the smartHomeSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema for smart home suggestions, including historical usage patterns and preferences.
const SmartHomeSuggestionsInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  historicalUsageData: z.string().describe('Historical energy usage data in JSON format.'),
  preferences: z.string().describe('User preferences for home automation in JSON format.'),
});
export type SmartHomeSuggestionsInput = z.infer<typeof SmartHomeSuggestionsInputSchema>;

// Output schema for smart home suggestions, including a list of suggestions and their explanations.
const SmartHomeSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      title: z.string().describe('The title of the suggestion.'),
      description: z.string().describe('A detailed explanation of the suggestion.'),
    })
  ).describe('A list of smart home suggestions.'),
});
export type SmartHomeSuggestionsOutput = z.infer<typeof SmartHomeSuggestionsOutputSchema>;

// Main function to generate smart home suggestions.
export async function smartHomeSuggestions(input: SmartHomeSuggestionsInput): Promise<SmartHomeSuggestionsOutput> {
  return smartHomeSuggestionsFlow(input);
}

// Define the prompt for generating smart home suggestions.
const smartHomeSuggestionsPrompt = ai.definePrompt({
  name: 'smartHomeSuggestionsPrompt',
  input: {schema: SmartHomeSuggestionsInputSchema},
  output: {schema: SmartHomeSuggestionsOutputSchema},
  prompt: `You are an AI assistant that provides smart suggestions for optimizing home energy consumption.
  Based on the user's historical usage data and preferences, generate a list of actionable suggestions.

  Historical Usage Data: {{{historicalUsageData}}}
  Preferences: {{{preferences}}}

  Suggestions should be tailored to the user's specific situation and should be practical and easy to implement.
  Each suggestion should have a title and a detailed explanation.

  Format your output as a JSON object conforming to the following schema:
  ${JSON.stringify(SmartHomeSuggestionsOutputSchema.describe(''))}
  `,
});

// Define the Genkit flow for smart home suggestions.
const smartHomeSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartHomeSuggestionsFlow',
    inputSchema: SmartHomeSuggestionsInputSchema,
    outputSchema: SmartHomeSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await smartHomeSuggestionsPrompt(input);
    return output!;
  }
);
