"use server"

import { Recipe } from './types';
import { generateRecipe as genRecipe, searchRecipes as searchRecipesImpl } from './recipe-actions';

// Re-export the functions with "use server" directive
export async function generateRecipe(userInput: string): Promise<Recipe> {
  return await genRecipe(userInput);
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  return await searchRecipesImpl(query);
}

// Export the Recipe type
export type { Recipe }; 