
import type { DocumentReference } from 'firebase-admin/firestore';
import type { ItemList, Recipe, Recipe as SchemaRecipe, SchemaValue } from '../../recipe-seo-schema';
import { parseStrings, parseThing } from '../../utils/schema-import';
import { parseStringsAsSingle } from './../../utils/schema-import';
import { parseExternalAuthors, type ExternalAuthor } from './external-author';
import { parseIngredients, type Ingredient, renderIngredient } from './ingredient';
import type { InstructionSection } from './instruction-section';
import { parsePublisher, type Publisher } from './publisher';
import type { AppUser } from './user';

export type AppRecipe = {
	id: string | null;
	owner: string | null;
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
	instructions: string[] | null;
	sections: InstructionSection[] | null;
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

export type PageInfo = {
	url: string;
	title: string;
	json: string[];
};

export const parseRecipe = (input: SchemaRecipe, pageInfo: PageInfo): AppRecipe => {
	const publishers = parsePublisher(input.publisher);

	const recipe: AppRecipe = {
		id: null,
		owner: null,
		cookTime: parseStringsAsSingle(input.cookTime),
		prepTime: parseStringsAsSingle(input.prepTime),
		totalTime: parseStringsAsSingle(input.totalTime),
		published: parseStringsAsSingle(input.datePublished) ?? new Date().toISOString(),
		description: parseStringsAsSingle(input.description) ?? '',
		headline: parseStringsAsSingle(input.name) ?? '',
		images: [],
		publishers: publishers.length
			? publishers
			: [
					{
						name: pageInfo.title,
						url: pageInfo.url,
						logo: null
					}
			  ],
		categories: parseStrings(input.recipeCategory),
		cuisines: parseStrings(input.recipeCuisine),
		externalAuthors: parseExternalAuthors(input.author),
		ingredients: parseIngredients(input.recipeIngredient),
		instructions: parseRecipeInstructions(input.recipeInstructions),
		servings: parseStringsAsSingle(input.recipeYield) ?? '1',
		externalUrl: pageInfo.url ?? null,
		sections: null
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

export const getRecipeSchemaJson = (appRecipe: AppRecipe): string => {
	const recipe: Recipe = {
		'@type': 'Recipe',
		'@id': `https://plate.bscox.com/recipes/${appRecipe.id}`,
		image: appRecipe.images,
		name: appRecipe.headline,
		headline: appRecipe.headline,
		author:
			appRecipe.externalAuthors?.map((x) => ({
				'@type': 'Person',
				name: x.name,
				url: x.url
			})) ?? undefined,
		cookTime: appRecipe.cookTime ?? undefined,
		datePublished: appRecipe.published,
		description: appRecipe.description,
		prepTime: appRecipe.prepTime ?? undefined,
		recipeCategory: appRecipe.categories,
		recipeCuisine: appRecipe.cuisines,
		recipeIngredient: appRecipe.ingredients.map((x) => renderIngredient(x)),
		recipeInstructions:
			appRecipe.instructions ?? appRecipe.sections?.flatMap((x) => x.instructions),
		recipeYield: appRecipe.servings ?? undefined,
		totalTime: appRecipe.totalTime ?? undefined
	};

	return JSON.stringify(recipe);
};
