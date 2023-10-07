import { z } from 'zod';

export const RecipeForm = z.object({
	title: z.string().nonempty(),
	description: z.string(),
	cookTime: z.number().gte(0),
	prepTime: z.number().gte(0),
	totalTime: z.number().gte(0),
	servings: z.number().gte(0),
	sections: z
		.object({
			name: z.string(),
			instructions: z.string().array()
		})
		.array()
		.default([{ name: '', instructions: [''] }]),
	ingredients: z.string().nonempty().array().default([''])
});
export type RecipeFormSchema = typeof RecipeForm;
