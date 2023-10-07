
import type { AppRecipe } from '../../models/entities/recipe';
import { adminFirestore } from './firebase-admin';
import { assignTypes } from './firestore';

export const recipeCollection = adminFirestore.collection('recipes').withConverter(assignTypes<AppRecipe>());

export const addRecipe = async (recipe: AppRecipe): Promise<string> => {
	const document = await recipeCollection.add(recipe);
	return document.id;
};

export const getRecipe = async (id: string): Promise<AppRecipe | undefined> => {
	const recipe = await recipeCollection.doc(id).get();
	return recipe.exists ? { ...recipe.data()!, id: recipe.id } : undefined;
};

export const listRecipes = async (): Promise<AppRecipe[]> => {
	const recipes = await recipeCollection.get();
	return recipes.docs.map((x) => ({ ...x.data()!, id: x.id }));
};
