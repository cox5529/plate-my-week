import { fail, redirect } from '@sveltejs/kit';
import { parse } from 'node-html-parser';

import { addRecipe } from '../../../lib/firebase/recipes.js';
import { parseRecipe } from '../../../lib/models/recipe.js';
import { validateRecipe } from '../../../lib/utils/validate.js';

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const url = data.get('url');
		const json = await getRecipeJsonFromPage(url?.toString());
		if (!json) {
			return fail(400, { url: { value: url, error: 'Invalid or no recipe found at that URL' } });
		}

		const recipes = validateRecipe(json);
		if (!recipes) {
			return fail(400, { url: { value: url, error: 'Invalid or no recipe found at that URL' } });
		}

		let id: string = '';
		for (const recipe of recipes) {
			const parsedRecipe = parseRecipe(recipe, url?.toString());
			id = await addRecipe(parsedRecipe);
		}

		throw redirect(302, `/recipes/${id}`);
	}
};

const getRecipeJsonFromPage = async (url: string | undefined): Promise<string | undefined> => {
	if (!url) {
		return;
	}

	const response = await fetch(url.toString());
	if (!response.ok) {
		return;
	}

	const body = await response.text();
	const html = parse(body);
	const json = html.querySelector('script[type="application/ld+json"]');
	return json?.innerText;
};
