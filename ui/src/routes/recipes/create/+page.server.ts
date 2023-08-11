import { fail, redirect } from '@sveltejs/kit';
import moment from 'moment';
import { superValidate } from 'sveltekit-superforms/server';

import { RecipeForm } from '../../../lib/form-schemas';
import { parseIngredientString } from '../../../lib/models/entities/ingredient';
import type { AppRecipe } from '../../../lib/models/entities/recipe';
import { verifyAuthentication } from '../../../lib/server/firebase/authentication';
import { usersCollection } from '../../../lib/server/firebase/users';
import { addRecipe } from '../../../lib/server/firebase/recipes';

export const load = async (event) => {
	await verifyAuthentication(event);
	const form = await superValidate(RecipeForm);
	return { form };
};

export const actions = {
	default: async ({ request, cookies }) => {
		const user = await verifyAuthentication({ cookies });
		const form = await superValidate(request, RecipeForm);
		if (!form.valid) {
			return fail(400, { form });
		}

		const recipe: AppRecipe = {
			id: null,
			headline: form.data.title,
			description: form.data.description,
			servings: `${form.data.servings}`,
			prepTime: moment.duration(form.data.prepTime, 'minute').toISOString(),
			cookTime: moment.duration(form.data.cookTime, 'minute').toISOString(),
			totalTime: moment.duration(form.data.totalTime, 'minute').toISOString(),
			ingredients: form.data.ingredients.map(parseIngredientString),
			owner: usersCollection.doc(user.id),
			published: moment().toISOString(),
			images: [],
			categories: [],
			cuisines: [],
			instructions: [],
			externalUrl: null,
			publishers: [],
			sections: form.data.sections
		};

		const id = await addRecipe(recipe);
		throw redirect(302, `/recipes/${id}`);
	}
};
