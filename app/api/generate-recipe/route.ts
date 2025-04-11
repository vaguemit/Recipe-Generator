import { NextRequest, NextResponse } from "next/server";
import { Recipe } from "@/lib/types";

// Fallback image when everything else fails
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop";

// Simplified fallback recipe generator
function createMockRecipe(userInput: string): Recipe {
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
    imageSrc: DEFAULT_IMAGE
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { userInput } = body;
    
    if (!userInput || typeof userInput !== 'string' || userInput.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide what you'd like to cook." },
        { status: 400 }
      );
    }
    
    // Clean up user input
    const cleanedInput = userInput.trim();
    
    // Check for API key
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.trim() === '') {
      console.error("GROQ_API_KEY is missing or empty");
      // Return mock recipe if API key is missing
      const mockRecipe = createMockRecipe(cleanedInput);
      return NextResponse.json(mockRecipe);
    }
    
    try {
      // Make API request to Groq
      console.log("API route: Making request to Groq API");
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY.trim()}`,
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
              content: `Generate a detailed recipe based on the following: "${cleanedInput}". Include specific ingredients, dietary preferences, and cuisine type if mentioned.`
            }
          ],
          temperature: 0.7,
          max_tokens: 2048,
          response_format: { type: "json_object" }
        }),
      });
      
      if (!response.ok) {
        console.error(`API request failed with status ${response.status}`);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      // Get response as text first for safer parsing
      const responseText = await response.text();
      
      if (!responseText || responseText.trim() === "") {
        console.error("Empty response from Groq API");
        throw new Error("Empty response from API");
      }
      
      // Try to parse the JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse API response as JSON", parseError);
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
      
      // Validate recipe has required fields
      if (!recipeData.name || !recipeData.ingredients || !recipeData.instructions) {
        console.error("Incomplete recipe data:", recipeData);
        throw new Error("Recipe data is incomplete");
      }
      
      // Return the complete recipe with a default image URL
      const completeRecipe: Recipe = {
        ...recipeData,
        imageSrc: DEFAULT_IMAGE
      };
      
      return NextResponse.json(completeRecipe);
    } catch (error) {
      console.error("Error in API call:", error);
      // If the API call fails, use a mock recipe
      const mockRecipe = createMockRecipe(cleanedInput);
      return NextResponse.json(mockRecipe);
    }
  } catch (error) {
    console.error("Unexpected error in API route:", error);
    // Final fallback for any other errors
    return NextResponse.json(
      { 
        name: "Simple Recipe",
        tags: ["Easy", "Quick", "Fallback"],
        cookingTime: "30 minutes",
        difficulty: "Easy",
        servings: 4,
        ingredients: ["Use your favorite ingredients"],
        instructions: ["Combine ingredients", "Cook until done", "Enjoy!"],
        nutritionalInfo: {
          calories: "Varies",
          protein: "Varies",
          carbs: "Varies",
          fat: "Varies"
        },
        tips: ["Customize to your taste"],
        imageSrc: DEFAULT_IMAGE
      }
    );
  }
} 