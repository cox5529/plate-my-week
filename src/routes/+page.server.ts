import { listRecipes } from '../lib/server/firebase/recipes';

export async function load() {
	const recipes = await listRecipes();
	return { recipes };
}
