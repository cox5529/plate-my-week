import { Validator } from 'jsonschema';

import type { Graph, Recipe } from '../schema';

import schema from '$lib/schemas/minimal-recipe.json';

export const validateRecipe = (json: string | undefined): Recipe[] | undefined => {
	if (!json) {
		return;
	}

	try {
		const validator = new Validator();
		let content = JSON.parse(json) as Recipe | Recipe[] | Graph;
		if ('@graph' in content) {
			content = content['@graph'].find((x) => x['@type'] === 'Recipe') as Recipe;
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
