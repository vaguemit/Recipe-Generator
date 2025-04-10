import { z } from "zod"

// Define the recipe schema
export const recipeSchema = z.object({
  name: z.string().describe("The name of the recipe"),
  tags: z.array(z.string()).describe("Tags for the recipe (dietary, cuisine type, etc.)"),
  cookingTime: z.string().describe("Total cooking time (e.g., '30 minutes')"),
  difficulty: z.string().describe("Difficulty level (Easy, Medium, Hard)"),
  servings: z.number().describe("Number of servings"),
  ingredients: z.array(z.string()).describe("List of ingredients with quantities"),
  instructions: z.array(z.string()).describe("Step-by-step cooking instructions"),
  nutritionalInfo: z
    .object({
      calories: z.string(),
      protein: z.string(),
      carbs: z.string(),
      fat: z.string(),
    })
    .describe("Nutritional information per serving"),
  tips: z.array(z.string()).optional().describe("Optional cooking tips"),
  imageSrc: z.string().optional().describe("URL of an image representing the recipe")
})

// Define the type for recipe responses
export type Recipe = z.infer<typeof recipeSchema> 