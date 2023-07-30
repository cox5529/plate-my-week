import { fail, redirect } from '@sveltejs/kit';
import { parse } from 'node-html-parser';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { parseRecipe, type PageInfo } from '../../../lib/models/entities/recipe';
import { Roles } from '../../../lib/models/enums/roles';
import { rephraseDescription, rephraseSteps } from '../../../lib/openai/recipe';
import type { Recipe } from '../../../lib/recipe-seo-schema';
import { verifyAuthentication } from '../../../lib/server/firebase/authentication';
import { addRecipe } from '../../../lib/server/firebase/recipes';
import { validateRecipes } from '../../../lib/utils/validate';

const schema = z.object({
	url: z.string().nonempty()
});

export const load = async (event) => {
	await verifyAuthentication(event, [Roles.Administrator]);
	const form = await superValidate(schema);
	return { form };
};

export const actions = {
	default: async (event) => {
		const userInfo = await verifyAuthentication(event, [Roles.Administrator]);
		const form = await superValidate(event.request, schema);
		if (!form.valid) {
			return fail(400, { form });
		}

		const url = form.data.url;
		const response = await getRecipeJsonFromPage(url?.toString());
		if (!response) {
			return setError(form, 'url', 'Invalid response from this URL');
		}

		const recipes = response.json.flatMap((x) => validateRecipes(x)).filter((x) => !!x) as Recipe[];
		if (!recipes.length) {
			return setError(form, 'url', 'Invalid or no recipe found at this URL');
		}

		let id: string = '';
		for (const recipe of recipes) {
			const parsedRecipe = parseRecipe(recipe, response);
			const rephrasedSteps = await rephraseSteps(parsedRecipe.instructions ?? []);
			if (!rephrasedSteps) {
				return setError(form, 'url', 'Failed to rephrase steps');
			}

			const rephrasedDescription = await rephraseDescription(parsedRecipe.description);
			if (!rephrasedDescription) {
				return setError(form, 'url', 'Failed to rephrase description');
			}

			parsedRecipe.description = rephrasedDescription;
			parsedRecipe.sections = rephrasedSteps;
			parsedRecipe.owner = userInfo.id;

			id = await addRecipe(parsedRecipe);
		}

		throw redirect(302, `/recipes/${id}`);
	}
};

const getRecipeJsonFromPage = async (url: string | undefined): Promise<PageInfo | undefined> => {
	if (!url) {
		return;
	}

	try {
		const response = await fetch(url.toString());
		if (!response.ok) {
			return;
		}

		const body = await response.text();
		const html = parse(body);
		const json = html
			.querySelectorAll('script[type="application/ld+json"]')
			.map((x) => x.innerText);
		return { url: url, title: html.querySelector('title')?.innerText ?? '', json };
	} catch {
		return;
	}
};
