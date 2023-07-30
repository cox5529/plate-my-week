import { error } from '@sveltejs/kit';

import { getRecipe } from '../../../lib/server/firebase/recipes.js';
import type { AppRecipe } from '../../../lib/models/entities/recipe.js';

export async function load(event): Promise<AppRecipe> {
	const id = event.params.id;
	const recipe = await getRecipe(id);

	if (!recipe) {
		throw error(404);
	}

	return recipe;
}
