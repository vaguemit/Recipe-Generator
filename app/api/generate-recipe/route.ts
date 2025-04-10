import { NextRequest, NextResponse } from "next/server";
import { Recipe, recipeSchema } from "@/lib/types";

// Remove edge runtime configuration
// export const config = {
//   runtime: 'edge', // Use Edge runtime for better performance
// };

// Helper function to create a response with proper headers
function createResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

// Improved function to fetch a recipe image from Unsplash API with better error handling
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
    
    // Sanitize the search term
    const sanitizedTerm = (searchTerm || "food").toLowerCase().replace(/[^a-z0-9]/g, ',');
    const imageUrl = `https://source.unsplash.com/featured/?food,${sanitizedTerm},recipe`;
    
    // Make a request with a timeout of 3 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    try {
      const response = await fetch(imageUrl, { 
        method: 'GET',
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response.url;
      }
    } catch (fetchError) {
      console.log("Image fetch timed out or failed:", fetchError);
      // Continue to fallback
    }
    
    // Return a random fallback image if fetch fails or times out
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  } catch (error) {
    console.error("Error fetching recipe image:", error);
    // Return the first fallback image if all else fails
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop";
  }
}

// Create a varied mock recipe based on user input for better fallback experience
function createMockRecipe(userInput: string): Recipe {
  // Extract relevant terms from user input for better personalization
  const inputLower = userInput.toLowerCase();
  const isMeatDish = inputLower.includes("chicken") || inputLower.includes("beef") || 
                      inputLower.includes("pork") || inputLower.includes("meat");
  const isVegetarian = inputLower.includes("vegetarian") || inputLower.includes("veggie");
  const isVegan = inputLower.includes("vegan");
  const isHealthy = inputLower.includes("healthy") || inputLower.includes("low calorie");
  const isQuick = inputLower.includes("quick") || inputLower.includes("easy") || 
                  inputLower.includes("fast") || inputLower.includes("simple");
  
  // Generate recipe name based on input
  let recipeName = `${userInput.charAt(0).toUpperCase() + userInput.slice(1).split(' ').slice(0, 3).join(' ')} Recipe`;
  
  // Generate tags based on input
  const tags = [];
  if (isQuick) tags.push("Quick");
  if (isVegan) tags.push("Vegan");
  else if (isVegetarian) tags.push("Vegetarian");
  if (isHealthy) tags.push("Healthy");
  if (isMeatDish) tags.push("Protein-Rich");
  
  // Add some default tags if none were added
  if (tags.length === 0) {
    tags.push("Homestyle", "Classic");
  }
  tags.push("30-Minute Recipe");
  
  // Generate cooking time
  const cookingTime = isQuick ? "20 minutes" : "40 minutes";
  
  // Generate difficulty
  const difficulty = isQuick ? "Easy" : "Medium";
  
  return {
    name: recipeName,
    tags,
    cookingTime,
    difficulty,
    servings: 4,
    ingredients: [
      "2 cups of main ingredient",
      "1 tablespoon olive oil",
      "1 onion, chopped",
      "2 cloves garlic, minced",
      "Salt and pepper to taste",
      "Fresh herbs for garnish",
      isVegetarian || isVegan ? "1 cup vegetable broth" : "1 cup chicken broth",
      "1/2 teaspoon mixed herbs"
    ],
    instructions: [
      "Prepare all ingredients.",
      "Heat oil in a pan over medium heat.",
      "Add onions and cook until translucent, about 3-5 minutes.",
      "Add garlic and cook for another minute.",
      "Add main ingredients and cook until done.",
      "Season with salt, pepper, and herbs.",
      "Serve hot and enjoy!"
    ],
    nutritionalInfo: {
      calories: isHealthy ? "250 kcal" : "350 kcal",
      protein: isMeatDish ? "25g" : "15g",
      carbs: isHealthy ? "20g" : "30g",
      fat: isHealthy ? "8g" : "15g"
    },
    tips: [
      "Prepare ingredients in advance for quicker cooking",
      "This recipe can be stored in the refrigerator for up to 3 days",
      isVegan ? "Substitute honey with maple syrup to keep it vegan" : 
               "Add a dollop of sour cream for extra richness"
    ],
    imageSrc: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop"
  };
}

export async function POST(request: NextRequest) {
  console.log("API route: Processing recipe generation request");
  console.log("Environment: ", process.env.NODE_ENV || "development", "Platform:", process.env.VERCEL ? "Vercel" : "Other");
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return createResponse({ success: true });
  }

  try {
    // Parse the request body with error handling
    let body;
    let userInput;
    
    try {
      body = await request.json();
      userInput = body?.userInput;
    } catch (parseError: unknown) {
      console.error("API route: Failed to parse request body", parseError);
      return createResponse(
        { 
          error: "Invalid request format.", 
          details: process.env.NODE_ENV === "development" ? 
            (parseError instanceof Error ? parseError.message : String(parseError)) : 
            undefined 
        },
        400
      );
    }
    
    if (!userInput || typeof userInput !== 'string' || userInput.trim().length === 0) {
      console.error("API route: Invalid or empty user input");
      return createResponse(
        { error: "Please provide a description of what you'd like to cook." },
        400
      );
    }
    
    // Trim and normalize user input
    userInput = userInput.trim();
    console.log("API route: Received user input:", userInput);
    
    // Check for environment variables and fallback gracefully
    if (!process.env.GROQ_API_KEY) {
      console.warn("API route: GROQ_API_KEY is not defined - using mock recipe");
      return createResponse(
        { 
          error: "API Key not configured in production",
          details: "The API key is missing. Check your environment variables.", 
          mockRecipe: true,
          recipe: createMockRecipe(userInput)
        },
        200
      );
    }
    
    // Log API key status (safely)
    console.log("API route: GROQ_API_KEY status", process.env.GROQ_API_KEY ? "Present (first 4 chars: " + process.env.GROQ_API_KEY.substring(0, 4) + "...)" : "Missing");
    
    // Make API request to Groq with timeout
    console.log("API route: Making Groq API request");
    try {
      // Set up request timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",  // Using a smaller, faster model for reliability
          messages: [
            {
              role: "system",
              content: `You are a professional chef's assistant. Generate a detailed recipe based on user input.
              Your response must be in the following JSON format:
              {
                "name": "Recipe Name",
                "tags": ["tag1", "tag2", "tag3"],
                "cookingTime": "time in minutes",
                "difficulty": "Easy/Medium/Hard",
                "servings": number,
                "ingredients": ["ingredient1", "ingredient2", ...],
                "instructions": ["step1", "step2", ...],
                "nutritionalInfo": {
                  "calories": "cal per serving",
                  "protein": "g per serving",
                  "carbs": "g per serving",
                  "fat": "g per serving"
                },
                "tips": ["tip1", "tip2", ...]
              }
              Return ONLY valid JSON with no additional text or characters.
              `
            },
            {
              role: "user",
              content: `Generate a detailed recipe based on the following: "${userInput}".
              
              If I mention specific ingredients, use them in the recipe.
              If I mention dietary preferences (vegan, gluten-free, etc.), respect those.
              If I mention a cuisine type, create a recipe in that style.
              
              Provide realistic cooking times, accurate ingredient measurements, and clear step-by-step instructions.
              Include reasonable nutritional information for the recipe.
              Add 2-3 helpful cooking tips.
              
              Make sure the recipe name is creative and appealing.
              Ensure the tags accurately reflect the recipe's characteristics.
              
              Return ONLY valid JSON with the recipe data, with no commentary or decorations.`
            }
          ],
          temperature: 0.7,
          max_tokens: 2048,
          response_format: { type: "json_object" }
        }),
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Could not get error details");
        console.error(`API route: Groq API request failed with status ${response.status}: ${errorText}`);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("API route: Failed to parse API response as JSON", jsonError);
        throw new Error("Invalid response format from API");
      }
      
      console.log("API route: Got Groq API response");
      
      if (!data.choices || !data.choices[0]?.message?.content) {
        console.error("API route: Invalid API response format:", JSON.stringify(data).substring(0, 200) + "...");
        throw new Error("Invalid response structure from Groq API");
      }
      
      try {
        // Parse the JSON response with extra validations
        const content = data.choices[0].message.content;
        console.log("API route: Parsing content");
        
        let recipeData;
        try {
          recipeData = JSON.parse(content.trim()) as Omit<Recipe, 'imageSrc'>;
        } catch (parseError) {
          console.error("API route: JSON parse error:", parseError);
          
          // Try to clean the content if it's not valid JSON
          const cleanedContent = content
            .replace(/^```json/i, '')
            .replace(/```$/i, '')
            .trim();
            
          try {
            recipeData = JSON.parse(cleanedContent) as Omit<Recipe, 'imageSrc'>;
          } catch (secondParseError) {
            console.error("API route: Second JSON parse error:", secondParseError);
            // Use regex as last resort
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              try {
                recipeData = JSON.parse(jsonMatch[0]) as Omit<Recipe, 'imageSrc'>;
              } catch (thirdParseError) {
                throw new Error("Could not parse recipe JSON after multiple attempts");
              }
            } else {
              throw new Error("Could not extract JSON from response");
            }
          }
        }
        
        // Validate and fill in missing fields if needed
        if (!recipeData) {
          throw new Error("No recipe data found in API response");
        }
        
        // Ensure all required fields exist with sensible defaults
        const validatedRecipe: Omit<Recipe, 'imageSrc'> = {
          name: recipeData.name || `Recipe based on ${userInput}`,
          tags: recipeData.tags || ["Homemade", "Custom"],
          cookingTime: recipeData.cookingTime || "30 minutes",
          difficulty: recipeData.difficulty || "Medium",
          servings: recipeData.servings || 4,
          ingredients: recipeData.ingredients || ["Ingredients not specified"],
          instructions: recipeData.instructions || ["Instructions not provided"],
          nutritionalInfo: recipeData.nutritionalInfo || {
            calories: "Not available",
            protein: "Not available",
            carbs: "Not available",
            fat: "Not available"
          },
          tips: recipeData.tips || ["Customize to your taste"]
        };
        
        // Fetch a recipe image based on the name, with retry logic
        let imageUrl;
        try {
          imageUrl = await fetchRecipeImage(validatedRecipe.name);
        } catch (imageError) {
          console.error("API route: Error fetching image, using fallback:", imageError);
          imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop";
        }
        
        // Return the complete recipe with the image URL
        const completeRecipe: Recipe = {
          ...validatedRecipe,
          imageSrc: imageUrl
        };
        
        console.log("API route: Successfully generated recipe:", completeRecipe.name);
        return createResponse(completeRecipe);
      } catch (parseError) {
        console.error("API route: Error parsing recipe data:", parseError);
        // If we can't parse the response, use a mock recipe with the image
        const mockRecipe = createMockRecipe(userInput);
        const imageUrl = await fetchRecipeImage(mockRecipe.name);
        mockRecipe.imageSrc = imageUrl;
        return createResponse(mockRecipe);
      }
    } catch (apiError) {
      console.error("API route: Error calling Groq API:", apiError);
      
      // Check if it's an abort error (timeout)
      const isTimeout = apiError instanceof Error && apiError.name === 'AbortError';
      if (isTimeout) {
        console.log("API route: Request timed out");
      }
      
      // If the API call fails, use a mock recipe
      const mockRecipe = createMockRecipe(userInput);
      const imageUrl = await fetchRecipeImage(mockRecipe.name);
      mockRecipe.imageSrc = imageUrl;
      
      return createResponse(mockRecipe);
    }
  } catch (error: unknown) {
    console.error("API route: Unhandled error:", error);
    
    // Create a basic recipe as a last resort
    try {
      const emergencyRecipe = {
        name: "Quick and Easy Recipe",
        tags: ["Simple", "Quick", "Fallback"],
        cookingTime: "30 minutes",
        difficulty: "Easy",
        servings: 4,
        ingredients: [
          "Your favorite ingredients",
          "Seasonings to taste"
        ],
        instructions: [
          "Combine ingredients according to your preference",
          "Cook until done to your liking",
          "Enjoy your creation!"
        ],
        nutritionalInfo: {
          calories: "Varies",
          protein: "Varies",
          carbs: "Varies",
          fat: "Varies"
        },
        tips: [
          "Customize this basic template with your favorite flavors",
          "Try again with more specific ingredients for a detailed recipe"
        ],
        imageSrc: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop"
      };
      
      console.log("API route: Returning emergency recipe");
      return createResponse({
        ...emergencyRecipe,
        _debug: {
          error: process.env.NODE_ENV === "development" ? 
            (error instanceof Error ? error.message : String(error)) : 
            "An error occurred",
          environment: process.env.NODE_ENV,
          apiKeyPresent: !!process.env.GROQ_API_KEY,
          emergency: true
        }
      });
    } catch (finalError) {
      // Absolute last resort
      console.error("API route: Even emergency recipe failed:", finalError);
      return createResponse(
        { 
          error: "Failed to generate recipe. Please try again with different ingredients or wording.",
          environment: process.env.NODE_ENV,
          details: process.env.NODE_ENV === "development" ? 
            (error instanceof Error ? error.message : String(error)) : 
            undefined
        },
        500
      );
    }
  }
} 