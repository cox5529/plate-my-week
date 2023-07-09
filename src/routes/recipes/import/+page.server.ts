import { fail, redirect } from '@sveltejs/kit';
import { parse } from 'node-html-parser';

import { addRecipe } from '../../../lib/firebase/recipes.js';
import { parseRecipe, type PageInfo } from '../../../lib/models/recipe.js';
import type { Recipe } from '../../../lib/schema.js';
import { validateRecipes } from '../../../lib/utils/validate.js';

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const url = data.get('url');
		const response = await getRecipeJsonFromPage(url?.toString());
		if (!response) {
			return fail(400, { url: { value: url, error: 'Invalid response from this URL' } });
		}

		const recipes = response.json.flatMap((x) => validateRecipes(x)).filter((x) => !!x) as Recipe[];
		if (!recipes.length) {
			return fail(400, { url: { value: url, error: 'Invalid or no recipe found at that URL' } });
		}

		let id: string = '';
		for (const recipe of recipes) {
			const parsedRecipe = parseRecipe(recipe, response);
			id = await addRecipe(parsedRecipe);
		}

		throw redirect(302, `/recipes/${id}`);
	}
};

const getRecipeJsonFromPage = async (url: string | undefined): Promise<PageInfo | undefined> => {
	if (!url) {
		return;
	}

	const response = await fetch(url.toString());
	if (!response.ok) {
		return;
	}

	const body = await response.text();
	const html = parse(body);
	const json = html.querySelectorAll('script[type="application/ld+json"]').map((x) => x.innerText);
	return { url: url, title: html.querySelector('title')?.innerText ?? '', json };
};
