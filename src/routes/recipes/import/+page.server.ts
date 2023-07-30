import { fail, redirect } from '@sveltejs/kit';
import { doc } from 'firebase/firestore';
import { parse } from 'node-html-parser';

import { addRecipe } from '../../../lib/server/firebase/recipes';
import { usersCollection } from '../../../lib/firebase/users';
import { parseRecipe, type PageInfo } from '../../../lib/models/entities/recipe';
import { Roles } from '../../../lib/models/enums/roles';
import { rephraseDescription, rephraseSteps } from '../../../lib/openai/recipe';
import type { Recipe } from '../../../lib/schema';
import { verifyAuthentication } from '../../../lib/server/firebase/authentication';
import { validateRecipes } from '../../../lib/utils/validate';

export const load = async (event) => {
	await verifyAuthentication(event, [Roles.Administrator]);
};

export const actions = {
	default: async (event) => {
		const userInfo = await verifyAuthentication(event, [Roles.Administrator]);

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
			const rephrasedSteps = await rephraseSteps(parsedRecipe.instructions ?? []);
			if (!rephrasedSteps) {
				return fail(400, { url: { value: url, error: 'Failed to rephrase steps' } });
			}

			const rephrasedDescription = await rephraseDescription(parsedRecipe.description);
			if (!rephrasedDescription) {
				return fail(400, { url: { value: url, error: 'Failed to rephrase description' } });
			}

			parsedRecipe.description = rephrasedDescription;
			parsedRecipe.sections = rephrasedSteps;
			parsedRecipe.owner = doc(usersCollection, userInfo.sub);

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
