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
    // Use a timeout to avoid hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch(imageUrl, { 
        method: 'GET',
        signal: controller.signal,
        // Add cache control headers
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response.url;
      }
    } catch (fetchError) {
      console.log("Image fetch timed out or failed:", fetchError);
    }
    
    // If API fails, return a random fallback image
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  } catch (error) {
    console.error("Error fetching recipe image:", error);
    // Return a placeholder if fetching fails
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop";
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
    // For Vercel deployments, use the Groq API directly instead of going through our API
    if (process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL) {
      // Make direct call to Groq instead of going through our API which requires auth
      console.log("Using direct Groq API call for Vercel deployment");
      
      // Check if we have the API key
      if (!process.env.GROQ_API_KEY) {
        console.error("GROQ_API_KEY is not defined");
        return createLocalMockRecipe(userInput);
      }
      
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content: "You are a professional chef's assistant. Generate a detailed recipe based on user input in JSON format with name, tags, cookingTime, difficulty, servings, ingredients, instructions, nutritionalInfo (calories, protein, carbs, fat), and tips fields."
              },
              {
                role: "user",
                content: `Generate a detailed recipe based on the following: "${userInput}". Include specific ingredients, dietary preferences, and cuisine type if mentioned.`
              }
            ],
            temperature: 0.7,
            max_tokens: 2048,
            response_format: { type: "json_object" }
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.choices || !data.choices[0]?.message?.content) {
          throw new Error("Invalid API response");
        }
        
        // Parse the JSON response
        const content = data.choices[0].message.content;
        const recipeData = JSON.parse(content);
        
        // Add default image
        return {
          ...recipeData,
          imageSrc: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop"
        };
      } catch (error) {
        console.error("Error in direct Groq API call:", error);
        return createLocalMockRecipe(userInput);
      }
    }
    
    // For local development or non-Vercel environments, use our API route
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const apiUrl = `${baseUrl}/api/generate-recipe`;
    
    console.log("Making request to:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({ userInput }),
      cache: 'no-store',
      credentials: 'include', // Include cookies for auth
    });

    // Get the response as text first to safely debug
    const responseText = await response.text();
    
    // Check if we got an auth page back (HTML response)
    if (responseText.includes("<!doctype html>") || responseText.includes("<html")) {
      console.error("Authentication error - received HTML instead of JSON");
      return createLocalMockRecipe(userInput);
    }
    
    // Try to parse as JSON
    try {
      const recipe = JSON.parse(responseText);
      
      // Check if the response contains an error
      if (recipe.error) {
        console.error("API returned error:", recipe.error);
        return createLocalMockRecipe(userInput);
      }
      
      console.log("Recipe generated successfully:", recipe.name);
      return recipe;
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      return createLocalMockRecipe(userInput);
    }
  } catch (error) {
    console.error("Error in generateRecipe:", error);
    return createLocalMockRecipe(userInput);
  }
}

// Create a local mock recipe without API calls
function createLocalMockRecipe(userInput: string): Recipe {
  const recipeName = `${userInput.charAt(0).toUpperCase() + userInput.slice(1).split(' ').slice(0, 3).join(' ')} Recipe`;
  
  return {
    name: recipeName,
    tags: ["Quick", "Easy", "30-Minute Recipe"],
    cookingTime: "30 minutes",
    difficulty: "Medium",
    servings: 4,
    ingredients: [
      "2 cups main ingredient",
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
      "Season with salt and pepper and serve."
    ],
    nutritionalInfo: {
      calories: "350 kcal",
      protein: "15g",
      carbs: "30g",
      fat: "15g"
    },
    tips: [
      "Prepare ingredients in advance for quicker cooking",
      "This recipe can be stored in the refrigerator for up to 3 days"
    ],
    imageSrc: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop"
  };
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