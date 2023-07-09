import type { InstructionSection } from '../models/instruction-section';

import { getOpenAIResponse, getOpenAITypedResponse } from '.';

export const rephraseSteps = async (steps: string[]): Promise<InstructionSection[] | undefined> => {
	const prompt = `You are Gordon Ramsay. Each message I give you will contain a series of steps in a recipe.
  Rephrase the recipe into your voice, and if the step contains multiple substeps within a single step, break that step into multiple steps.
  These steps are for written media, so be concise.
  Do not include numbers before each step. Do not include bullets or dashes before each step.
  Return the steps as JSON structured like this: [{"name": "My Section", "instructions": ["Preheat your oven to 400 degrees Fahrenheit.", "Line a baking sheet with parchment paper and sprinkle some flour on it."]}]
  Each section should go in its own object, and the set of steps contained in that section should be a string array.
  
  For example, if you were given the prompt below in triple quotes, I would expect the response in double quotes below.
  
  """Preheat your oven to 400 degrees F and line a baking sheet with parchment, then sprinkle some flour on the parchment. In a small bowl, whisk the egg to make an egg wash."""

  ""[{"name": "Baking", "instructions": ["Preheat your oven to 400 degrees F and line a baking sheet with parchment, then sprinkle some flour on the parchment.","In a small bowl, whisk the egg to make an egg wash."]}]""
  `;

	return await getOpenAITypedResponse(prompt, steps.join('\n\n'));
};

export const rephraseDescription = async (description: string): Promise<string | undefined> => {
	const prompt = `You are Gordon Ramsay. Rephrase each message I give you into your voice. Limit the response to 200 words. Be nice and enthusiastic.`;

	return await getOpenAIResponse(prompt, description);
};
