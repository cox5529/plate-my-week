import type { ItemList, Recipe as SchemaRecipe, SchemaValue } from '../schema';
import { parseImages, parseStrings, parseThing } from '../utils/schema-import';
import { parseStringsAsSingle } from './../utils/schema-import';
import { parseExternalAuthors, type ExternalAuthor } from './external-author';
import { parseIngredients, type Ingredient } from './ingredient';
import { parsePublisher, type Publisher } from './publisher';

export type AppRecipe = {
	id: string | null;
	owner: string;
	externalAuthors?: ExternalAuthor[];
	cookTime: string | null;
	prepTime: string | null;
	totalTime: string | null;
	published: string;
	description: string;
	headline: string;
	images: string[];
	publishers: Publisher[];
	categories: string[];
	cuisines: string[];
	ingredients: Ingredient[];
	instructions: string[];
	servings: string | null;
	externalUrl: string | null;
};

type MinimalImage =
	| string
	| {
			url: string;
	  };

export type MinimalRecipe = {
	name: string;
	image: MinimalImage | MinimalImage[];
	recipeIngredient: string[];
	recipeInstructions: {
		text: string;
	}[];
};

export const parseRecipe = (input: SchemaRecipe, externalUrl?: string): AppRecipe => {
	const recipe: AppRecipe = {
		id: null,
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
		servings: parseStringsAsSingle(input.recipeYield) ?? '1',
		externalUrl: externalUrl ?? null
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
