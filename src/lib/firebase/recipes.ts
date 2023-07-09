import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore';

import type { AppRecipe } from '../models/recipe';

import { assignTypes, db } from '.';

export const recipeCollection = collection(db, 'recipes').withConverter(assignTypes<AppRecipe>());

export const addRecipe = async (recipe: AppRecipe): Promise<string> => {
	const document = await addDoc(recipeCollection, recipe);
	return document.id;
};

export const getRecipe = async (id: string): Promise<AppRecipe | undefined> => {
	const recipe = await getDoc(doc(recipeCollection, id));
	return recipe.exists() ? { ...recipe.data(), id: recipe.id } : undefined;
};

export const listRecipes = async (): Promise<AppRecipe[]> => {
	const recipes = await getDocs(recipeCollection);
	return recipes.docs.map((x) => ({ ...x.data(), id: x.id }));
};
