"use server"

import { Recipe, recipeSchema } from "./types"

// Fetch a real image from Unsplash API based on search term
export async function fetchRecipeImage(searchTerm: string): Promise<string> {
  try {
    // Default fallback images from Unsplash - high quality, diverse food images
    const fallbackImages = [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop", // Colorful food spread
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop", // Pasta dish
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop", // Vegetable salad
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop", // Pizza
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop", // Salmon dish
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop", // Breakfast
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=600&fit=crop", // Dessert
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop", // BBQ/grilled food
      "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=800&h=600&fit=crop", // Sandwiches
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop", // Soup
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop", // Healthy bowl
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=600&fit=crop", // Cupcakes
      "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&h=600&fit=crop", // Burger
      "https://images.unsplash.com/photo-1532980400857-e8d9d275d858?w=800&h=600&fit=crop"  // Curry
    ];
    
    // Extract relevant keywords from the search term
    const extractKeywords = (term: string): string[] => {
      // Common food categories and cuisines for better image matching
      const foodCategories = [
        'pasta', 'pizza', 'salad', 'soup', 'stew', 'curry', 'burger', 'sandwich',
        'breakfast', 'dessert', 'cake', 'cookie', 'fish', 'seafood', 'chicken',
        'beef', 'pork', 'lamb', 'vegan', 'vegetarian', 'rice', 'noodle', 'bread',
        'grill', 'roast', 'bake', 'mexican', 'italian', 'indian', 'thai', 'french',
        'chinese', 'japanese', 'mediterranean'
      ];
      
      const words = term.toLowerCase().split(/\s+/);
      const keywords = words.filter(word => 
        word.length > 2 && 
        !['with', 'and', 'the', 'for', 'from', 'recipe'].includes(word)
      );
      
      // Check if any food categories are in the search term
      const foundCategories = foodCategories.filter(category => 
        term.toLowerCase().includes(category)
      );
      
      return [...keywords, ...foundCategories].slice(0, 3);
    };
    
    const keywords = extractKeywords(searchTerm);
    
    // If we couldn't extract meaningful keywords, use a random fallback
    if (keywords.length === 0) {
      return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    }
    
    // Create a search query with extracted keywords
    const searchQuery = `food,${keywords.join(',')},cooking,recipe`;
    const sanitizedQuery = searchQuery.replace(/[^a-z0-9,]/g, '');
    
    // Use Unsplash Source API with better parameters
    const imageUrl = `https://source.unsplash.com/featured/?${sanitizedQuery}&fit=crop&w=800&h=600&q=80`;
    
    // Try multiple attempts for better results
    const maxAttempts = 2;
    let lastUrl = '';
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Make a request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      try {
        const response = await fetch(`${imageUrl}&attempt=${attempt}`, { 
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const url = response.url;
          
          // Skip if we got the same URL twice (Unsplash sometimes returns the same image)
          if (url !== lastUrl || attempt === maxAttempts - 1) {
            return url;
          }
          
          lastUrl = url;
        }
      } catch (fetchError) {
        console.log(`Image fetch attempt ${attempt + 1} failed:`, fetchError);
      }
    }
    
    // If all attempts fail, return a category-specific fallback image if possible
    const getCategoryFallback = (term: string): string | null => {
      const categories = [
        { keywords: ['pasta', 'italian', 'noodle'], index: 1 },
        { keywords: ['salad', 'vegetable', 'vegetarian', 'vegan'], index: 2 },
        { keywords: ['pizza'], index: 3 },
        { keywords: ['fish', 'salmon', 'seafood'], index: 4 },
        { keywords: ['breakfast', 'brunch', 'morning'], index: 5 },
        { keywords: ['cake', 'dessert', 'cookie', 'sweet'], index: 6 },
        { keywords: ['grill', 'bbq', 'barbecue'], index: 7 },
        { keywords: ['sandwich', 'bread', 'toast'], index: 8 },
        { keywords: ['soup', 'stew'], index: 9 },
        { keywords: ['healthy', 'bowl'], index: 10 },
        { keywords: ['cupcake', 'muffin'], index: 11 },
        { keywords: ['burger'], index: 12 },
        { keywords: ['curry', 'indian', 'thai'], index: 13 }
      ];
      
      for (const category of categories) {
        if (category.keywords.some(word => term.toLowerCase().includes(word))) {
          return fallbackImages[category.index];
        }
      }
      
      return null;
    };
    
    const categoryFallback = getCategoryFallback(searchTerm);
    if (categoryFallback) {
      return categoryFallback;
    }
    
    // Last resort - return a random fallback image
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

// Validate and format recipe data to match our schema
function validateAndFormatRecipe(data: any): Recipe {
  try {
    // Basic validation
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid recipe data: not an object');
    }
    
    // Ensure required fields exist
    const requiredFields = ['name', 'ingredients', 'instructions'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Invalid recipe data: missing ${field}`);
      }
    }
    
    // Format the recipe according to our schema
    const recipe: Recipe = {
      name: String(data.name || ''),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : ['General'],
      cookingTime: typeof data.cookingTime === 'string' ? data.cookingTime : '30 minutes',
      difficulty: typeof data.difficulty === 'string' ? data.difficulty : 'Medium',
      servings: typeof data.servings === 'number' ? data.servings : 4,
      ingredients: Array.isArray(data.ingredients) 
        ? data.ingredients.map(String) 
        : ['Ingredients not specified'],
      instructions: Array.isArray(data.instructions) 
        ? data.instructions.map(String) 
        : ['Instructions not specified'],
      nutritionalInfo: {
        calories: typeof data.nutritionalInfo?.calories === 'string' 
          ? data.nutritionalInfo.calories 
          : 'Not specified',
        protein: typeof data.nutritionalInfo?.protein === 'string' 
          ? data.nutritionalInfo.protein 
          : 'Not specified',
        carbs: typeof data.nutritionalInfo?.carbs === 'string' 
          ? data.nutritionalInfo.carbs 
          : 'Not specified',
        fat: typeof data.nutritionalInfo?.fat === 'string' 
          ? data.nutritionalInfo.fat 
          : 'Not specified',
      },
      tips: Array.isArray(data.tips) ? data.tips.map(String) : [],
      imageSrc: typeof data.imageSrc === 'string' ? data.imageSrc : undefined
    };
    
    return recipe;
  } catch (error) {
    console.error('Recipe validation error:', error);
    throw new Error('Failed to validate recipe data');
  }
}

// This function directly makes the API call without using the Groq SDK
// which is causing issues with Next.js server actions
export async function generateRecipe(userInput: string): Promise<Recipe> {
  console.log("Generating recipe for:", userInput);
  
  try {
    // Detect if we're in production (Vercel) environment
    const isVercelEnvironment = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    if (isVercelEnvironment) {
      // Make direct call to Groq instead of going through our API which requires auth
      console.log("Using direct Groq API call for Vercel deployment");
      
      // Check if we have the API key
      if (!process.env.GROQ_API_KEY) {
        console.error("GROQ_API_KEY is not defined in environment variables");
        return createLocalMockRecipe(userInput);
      }
      
      try {
        const apiKey = process.env.GROQ_API_KEY.trim();
        if (!apiKey) {
          throw new Error("GROQ_API_KEY is empty");
        }
        
        console.log("Making request to Groq API");
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content: "You are a professional chef's assistant. Generate a recipe in valid JSON format with the following structure exactly: {\"name\": string, \"tags\": string[], \"cookingTime\": string, \"difficulty\": string, \"servings\": number, \"ingredients\": string[], \"instructions\": string[], \"nutritionalInfo\": {\"calories\": string, \"protein\": string, \"carbs\": string, \"fat\": string}, \"tips\": string[]}. Do not include nested objects in arrays. Ensure all values have proper types and formatting."
              },
              {
                role: "user",
                content: `Generate a recipe for: "${userInput}". Be sure to follow the exact JSON format specified.`
              }
            ],
            temperature: 0.7,
            max_tokens: 2048,
            response_format: { type: "json_object" }
          }),
        });
        
        if (!response.ok) {
          const errorStatus = response.status;
          let errorText = "";
          try {
            const errorData = await response.text();
            errorText = errorData;
          } catch (e) {
            // Ignore if we can't parse error text
          }
          
          console.error(`API request failed with status ${errorStatus}: ${errorText}`);
          throw new Error(`API request failed with status ${errorStatus}`);
        }
        
        // Get response as text first for safer parsing
        const responseText = await response.text();
        
        if (!responseText || responseText.trim() === "") {
          throw new Error("Empty response from API");
        }
        
        // Try to parse the JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse API response as JSON:", parseError);
          throw new Error("Invalid JSON response from API");
        }
        
        if (!data.choices || !data.choices[0]?.message?.content) {
          console.error("Malformed API response:", data);
          throw new Error("Invalid API response structure");
        }
        
        // Parse the JSON response
        const content = data.choices[0].message.content;
        let recipeData;
        
        try {
          recipeData = JSON.parse(content);
        } catch (parseError) {
          console.error("Failed to parse recipe data:", parseError);
          throw new Error("Invalid recipe format");
        }
        
        // Validate and format recipe data
        try {
          recipeData = validateAndFormatRecipe(recipeData);
        } catch (validationError) {
          console.error("Recipe validation error:", validationError);
          throw new Error("Failed to validate recipe data");
        }
        
        // Fetch a recipe image based on the name
        let imageSrc;
        try {
          imageSrc = await fetchRecipeImage(recipeData.name);
        } catch (imageError) {
          console.error("Error fetching image:", imageError);
          // Use default image if fetch fails
          imageSrc = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop";
        }
        
        // Return complete recipe
        return {
          ...recipeData,
          imageSrc
        };
      } catch (error) {
        console.error("Error in direct Groq API call:", error);
        // Return mock recipe but include the error to help debugging
        const mockRecipe = createLocalMockRecipe(userInput);
        console.log("Returning mock recipe due to API error");
        return mockRecipe;
      }
    }
    
    // For local development or non-Vercel environments, use our API route
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const apiUrl = `${baseUrl}/api/generate-recipe`;
    
    console.log("Making request to local API:", apiUrl);
    
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