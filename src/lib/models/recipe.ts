import type { Recipe as SchemaRecipe } from 'schema-dts';

export type Recipe = {
  content: SchemaRecipe;
  owner: string;
};

export type MinimalRecipe = {
  name: string;
  image: string | {
    url: string;
  };
  recipeIngredient: string[];
  recipeInstructions: {
    text: string;
  }[];
};
