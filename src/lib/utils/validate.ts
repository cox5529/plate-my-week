import { Validator } from 'jsonschema';

import type { Graph, Recipe } from '../schema';

import schema from '$lib/schemas/minimal-recipe.json';

export const validateRecipes = (json: string | undefined): Recipe[] | undefined => {
	if (!json) {
		return;
	}

	try {
		const baseContent = JSON.parse(json) as Recipe | Recipe[] | Graph;
		let content = baseContent;
		if ('@graph' in content) {
			content = getRecipe(baseContent as Graph) as Recipe;
		}

		if (Array.isArray(content)) {
			content = content.filter(
				(x) =>
					x['@type'] === 'Recipe' ||
					(Array.isArray(x['@type']) && x['@type'].find((t) => t === 'Recipe'))
			);
			for (const element of content) {
				const [recipe, isRecipe] = validateRecipe(element);
				if (!recipe && isRecipe) {
					return;
				}
			}

			return content;
		}

		const [recipe, isRecipe] = validateRecipe(content);
		if (!recipe && isRecipe) {
			return;
		} else if (!recipe) {
			return [];
		}

		return [recipe];
	} catch (e) {
		console.error(e);
		return;
	}
};

const validateRecipe = (recipe: Recipe): [Recipe | undefined, boolean] => {
	if (recipe['@type'] !== 'Recipe') {
		return [undefined, false];
	}

	const validator = new Validator();
	const errors = validator.validate(recipe, schema).errors;
	if (errors.length > 0) {
		console.warn(errors);
		return [undefined, true];
	}

	return [recipe, true];
};

const getRecipe = (graph: Graph): Recipe => {
	const recipe = graph['@graph'].find((x) => x['@type'] === 'Recipe')!;
	dereferenceObjects(recipe, graph);

	return recipe;
};

const dereferenceObjects = (parent: any, graph: Graph) => {
	for (const key of Object.keys(parent)) {
		if (typeof parent[key] !== 'object' || key === 'isPartOf') {
			continue;
		}

		if ('@id' in parent[key] && Object.keys(parent[key]).length === 1) {
			const element = graph['@graph'].find((x) => x['@id'] === parent[key]['@id']);
			parent[key] = element;
		}

		if (typeof parent[key] === 'object') {
			dereferenceObjects(parent[key], graph);
		}
	}
};
