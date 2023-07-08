import { addDoc, collection } from 'firebase/firestore';

import type { Recipe } from '../models/recipe';

import { assignTypes, db } from '.';

export const recipeCollection = collection(db, 'recipes').withConverter(assignTypes<Recipe>());

export const addRecipe = async (recipe: Recipe): Promise<string> => {
	const document = await addDoc(recipeCollection, recipe);
	return document.id;
};
