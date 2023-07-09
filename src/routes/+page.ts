import { listRecipes } from '../lib/firebase/recipes';

export async function load() {
	const recipes = await listRecipes();
	return { recipes };
}
