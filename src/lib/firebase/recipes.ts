import { addDoc, collection, doc, getDoc } from 'firebase/firestore';

import type { AppRecipe } from '../models/recipe';

import { assignTypes, db } from '.';

export const recipeCollection = collection(db, 'recipes').withConverter(assignTypes<AppRecipe>());

export const addRecipe = async (recipe: AppRecipe): Promise<string> => {
	const document = await addDoc(recipeCollection, recipe);
	return document.id;
};

export const getRecipe = async (id: string): Promise<AppRecipe | undefined> => {
  const recipe = await getDoc(doc(recipeCollection, id));
  return recipe.data();
};
