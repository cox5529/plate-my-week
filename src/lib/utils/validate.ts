import { Validator, type Schema } from 'jsonschema';

import schema from '$lib/schemas/minimal-recipe.json';
import type { Recipe } from '../schema';

export const validateRecipe = (json: string | undefined): Recipe[] | undefined => {
	if (!json) {
		return;
	}

	try {
		const validator = new Validator();
		const content = JSON.parse(json) as Recipe | Recipe[];
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

		const hasErrors = validator.validate(content, schema).errors.length !== 0;
		return hasErrors ? undefined : [content];
	} catch {
		return;
	}
};
