import { error } from '@sveltejs/kit';

import type { AppRecipe } from '../../../lib/models/entities/recipe.js';
import { getRecipe } from '../../../lib/server/firebase/recipes.js';
import { getUser } from '../../../lib/server/firebase/users.js';

export async function load(event) {
	const id = event.params.id;
	const recipe = await getRecipe(id);

	if (!recipe) {
		throw error(404);
	}

	const localAuthor = recipe.owner ? getUser(recipe.owner) : null;

	return { recipe, localAuthor };
}
