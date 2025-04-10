import { NextRequest, NextResponse } from "next/server";
import { Recipe, recipeSchema } from "@/lib/types";

// Fetch a real image from Unsplash API based on search term
async function fetchRecipeImage(searchTerm: string): Promise<string> {
  try {
    // Default fallback images from placeholder services in case API fails
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

export async function POST(request: NextRequest) {
  console.log("API route: Processing recipe generation request");
  
  try {
    // Parse the request body
    const body = await request.json();
    const { userInput } = body;
    
    if (!userInput || typeof userInput !== 'string') {
      console.error("API route: Invalid user input");
      return NextResponse.json(
        { error: "Invalid input. Please provide a valid userInput string." },
        { status: 400 }
      );
    }
    
    console.log("API route: Received user input:", userInput);
    
    // Check for API key
    if (!process.env.GROQ_API_KEY) {
      console.error("API route: GROQ_API_KEY is not defined");
      
      // Use mock recipe as fallback when API key is missing
      const mockRecipe = createMockRecipe(userInput);
      console.log("API route: Returning mock recipe due to missing API key");
      return NextResponse.json(mockRecipe);
    }
    
    // Make API request to Groq
    console.log("API route: Making Groq API request");
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
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
              
              Return ONLY the JSON with no additional commentary.`
            }
          ],
          temperature: 0.7,
          max_tokens: 2048,
          response_format: { type: "json_object" }
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API route: Groq API request failed with status ${response.status}: ${errorText}`);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API route: Got Groq API response");
      
      if (!data.choices || !data.choices[0]?.message?.content) {
        console.error("API route: Invalid API response format:", data);
        throw new Error("Invalid response from Groq API");
      }
      
      try {
        // Parse the JSON response
        const content = data.choices[0].message.content;
        console.log("API route: Parsing content");
        
        let recipeData;
        try {
          recipeData = JSON.parse(content) as Omit<Recipe, 'imageSrc'>;
        } catch (parseError) {
          console.error("API route: JSON parse error:", parseError);
          // If parsing fails, use a regex to extract JSON
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            recipeData = JSON.parse(jsonMatch[0]) as Omit<Recipe, 'imageSrc'>;
          } else {
            throw new Error("Failed to parse response JSON");
          }
        }
        
        // Validate that the recipe has all the required fields
        if (!recipeData.name || !recipeData.ingredients || !recipeData.instructions) {
          console.error("API route: Invalid recipe data:", recipeData);
          throw new Error("Recipe data is missing required fields");
        }
        
        // Fetch a recipe image based on the name
        const imageUrl = await fetchRecipeImage(recipeData.name);
        
        // Return the complete recipe with the image URL
        const completeRecipe: Recipe = {
          ...recipeData,
          imageSrc: imageUrl
        };
        
        console.log("API route: Successfully generated recipe:", completeRecipe.name);
        return NextResponse.json(completeRecipe);
      } catch (parseError) {
        console.error("API route: Error parsing recipe data:", parseError);
        // If we can't parse the response, use a mock recipe
        const mockRecipe = createMockRecipe(userInput);
        return NextResponse.json(mockRecipe);
      }
    } catch (apiError) {
      console.error("API route: Error calling Groq API:", apiError);
      // If the API call fails, use a mock recipe
      const mockRecipe = createMockRecipe(userInput);
      return NextResponse.json(mockRecipe);
    }
  } catch (error) {
    console.error("API route: Unhandled error:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe. Please try again." },
      { status: 500 }
    );
  }
} 