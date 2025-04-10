"use server"

import { Recipe, recipeSchema } from "./types"

// Fetch a real image from Unsplash API based on search term
async function fetchRecipeImage(searchTerm: string): Promise<string> {
  try {
    // Default fallback images from Unsplash in case the API fails
    const fallbackImages = [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop"
    ];
    
    // Use Unsplash Source API (no API key required for basic usage)
    // Format: https://source.unsplash.com/featured/?[search-term]
    const sanitizedTerm = searchTerm.toLowerCase().replace(/[^a-z0-9]/g, ',');
    const imageUrl = `https://source.unsplash.com/featured/?food,${sanitizedTerm},recipe`;
    
    // Make a request to get the redirected URL
    const response = await fetch(imageUrl, { method: 'GET' });
    
    if (response.ok) {
      return response.url;
    } else {
      // If API fails, return a random fallback image
      return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    }
  } catch (error) {
    console.error("Error fetching recipe image:", error);
    // Return a placeholder if fetching fails
    return "https://placehold.co/800x600/orange/white?text=Recipe+Image";
  }
}

// Create a mock recipe in case the API fails
function createMockRecipe(userInput: string): Recipe {
  return {
    name: `${userInput.charAt(0).toUpperCase() + userInput.slice(1).split(' ').slice(0, 3).join(' ')} Recipe`,
    tags: ["Quick", "Easy", "Everyday"],
    cookingTime: "30 minutes",
    difficulty: "Easy",
    servings: 4,
    ingredients: [
      "2 cups of main ingredient",
      "1 tablespoon olive oil",
      "1 onion, chopped",
      "2 cloves garlic, minced",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Prepare all ingredients.",
      "Heat oil in a pan over medium heat.",
      "Add onions and cook until translucent.",
      "Add garlic and cook for another minute.",
      "Add main ingredients and cook until done.",
      "Season with salt and pepper."
    ],
    nutritionalInfo: {
      calories: "320 kcal",
      protein: "15g",
      carbs: "25g",
      fat: "12g"
    },
    tips: [
      "Prepare ingredients in advance for quicker cooking",
      "This recipe can be stored in the refrigerator for up to 3 days"
    ],
    imageSrc: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop"
  };
}

// This function directly makes the API call without using the Groq SDK
// which is causing issues with Next.js server actions
export async function generateRecipe(userInput: string): Promise<Recipe> {
  console.log("Generating recipe for:", userInput);
  
  try {
    // Use the local API route instead of calling Groq directly
    // We need to use the origin from environment variables or construct the URL manually for server components
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/generate-recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const recipe = await response.json();
    console.log("Recipe generated successfully:", recipe.name);
    return recipe;
  } catch (error) {
    console.error("Error in generateRecipe:", error);
    throw new Error("Failed to generate recipe");
  }
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  console.log("Searching recipes for:", query);
  
  try {
    // Simulate a recipe search with variations of the recipe
    const baseRecipe = await generateRecipe(query);
    
    // Create variations of the recipe to simulate search results
    const recipes: Recipe[] = [
      baseRecipe,
      {
        ...baseRecipe,
        name: `Quick ${baseRecipe.name}`,
        cookingTime: "15 minutes",
        difficulty: "Easy",
        tags: [...baseRecipe.tags, "Quick", "Under 30 Minutes"]
      },
      {
        ...baseRecipe,
        name: `Deluxe ${baseRecipe.name}`,
        cookingTime: "45 minutes",
        difficulty: "Medium",
        tags: [...baseRecipe.tags, "Gourmet", "Special Occasion"]
      }
    ];
    
    return recipes;
  } catch (error) {
    console.error("Error in searchRecipes:", error);
    throw new Error("Failed to search recipes");
  }
} 