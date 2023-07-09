import type { ItemList, Recipe as SchemaRecipe, SchemaValue } from '../schema';
import { parseImages, parseStrings, parseThing } from '../utils/schema-import';
import { parseStringsAsSingle } from './../utils/schema-import';
import { parseExternalAuthors, type ExternalAuthor } from './external-author';
import { parseIngredients, type Ingredient } from './ingredient';
import { parsePublisher, type Publisher } from './publisher';

export type AppRecipe = {
	owner: string;
	externalAuthors?: ExternalAuthor[];
	cookTime?: string;
	prepTime?: string;
	totalTime?: string;
	published: string;
	description?: string;
	headline: string;
	images: string[];
	publishers?: Publisher[];
	categories: string[];
	cuisines: string[];
	ingredients: Ingredient[];
	instructions: string[];
	servings?: string;
};

export type MinimalRecipe = {
	name: string;
	image:
		| string
		| {
				url: string;
		  };
	recipeIngredient: string[];
	recipeInstructions: {
		text: string;
	}[];
};

export const parseRecipe = (input: SchemaRecipe): AppRecipe => {
	const recipe: AppRecipe = {
		owner: '',
		cookTime: parseStringsAsSingle(input.cookTime),
		prepTime: parseStringsAsSingle(input.prepTime),
		totalTime: parseStringsAsSingle(input.totalTime),
		published: parseStringsAsSingle(input.datePublished) ?? new Date().toISOString(),
		description: parseStringsAsSingle(input.description) ?? '',
		headline: parseStringsAsSingle(input.name) ?? '',
		images: parseImages(input.image),
		publishers: parsePublisher(input.publisher),
		categories: parseStrings(input.recipeCategory),
		cuisines: parseStrings(input.recipeCuisine),
		externalAuthors: parseExternalAuthors(input.author),
		ingredients: parseIngredients(input.recipeIngredient),
		instructions: parseRecipeInstructions(input.recipeInstructions),
		servings: parseStringsAsSingle(input.recipeYield) ?? '1'
	};

	return recipe;
};

export const parseRecipeInstructions = (
	input: SchemaValue<ItemList | string> | undefined
): string[] =>
	parseThing(input, (value: ItemList | string) => {
		if (typeof value === 'string') {
			return value;
		}

		if (value['@type'] === 'HowToStep') {
			return parseStrings(value.text).join(' ');
		}
	});
