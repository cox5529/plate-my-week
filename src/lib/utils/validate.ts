import { Validator } from 'jsonschema';

import type { Graph, Recipe } from '../schema';

import schema from '$lib/schemas/minimal-recipe.json';

export const validateRecipe = (json: string | undefined): Recipe[] | undefined => {
	if (!json) {
		return;
	}

	try {
		const validator = new Validator();
		const baseContent = JSON.parse(json) as Recipe | Recipe[] | Graph;
		let content = baseContent;
		if ('@graph' in content) {
			content = getRecipe(baseContent as Graph) as Recipe;
		}

		if (Array.isArray(content)) {
			for (const element of content) {
				const errors = validator.validate(element, schema).errors;
				if (errors.length > 0) {
					console.warn(errors);
					return undefined;
				}
			}

			return content;
		}

		const errors = validator.validate(content, schema).errors;
		if (errors.length > 0) {
			console.warn(errors);
			return undefined;
		}

		return [content];
	} catch {
		return;
	}
};

const getRecipe = (graph: Graph): Recipe => {
	const recipe = graph['@graph'].find((x) => x['@type'] === 'Recipe')!;
	dereferenceObjects(recipe, graph);

	return recipe;
};

const dereferenceObjects = (parent: any, graph: Graph) => {
	for (const key of Object.keys(parent)) {
		if (typeof parent[key] !== 'object') {
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
