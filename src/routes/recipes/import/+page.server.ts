import { fail, redirect } from '@sveltejs/kit';

import recipeSchema from '$lib/schemas/minimal-recipe.json';
import { addRecipe } from '../../../lib/firebase/recipes.js';
import { validate } from '../../../lib/utils/validate.js';

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const json = data.get('json');
		const recipe = validate(json?.toString(), recipeSchema);
		if (!recipe) {
			return fail(400, { json: { value: json, error: 'Invalid recipe JSON' } });
		}

		const id = await addRecipe({ content: recipe, owner: '' });
		throw redirect(302, `/recipes/${id}`);
	}
};
