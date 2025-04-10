"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Loader2, Share2, BookmarkPlus, ChefHat, Sparkles, Info } from "lucide-react"
import RecipeDisplay from "./recipe-display"
import { generateRecipe, type Recipe } from "@/lib/server-actions"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SavedRecipes from "./saved-recipes"
import { Tag } from "@/components/ui/tag"
import { Skeleton } from "@/components/ui/skeleton"

// Quick suggestion buttons for recipe ideas
const SUGGESTIONS = [
  "Healthy breakfast with eggs",
  "Quick dinner with chicken",
  "Vegetarian pasta dish",
  "Gluten-free dessert",
  "Vegan lunch ideas",
  "30-minute meal with beef",
  "Kid-friendly snacks",
  "Low-carb dinner options"
];

export default function RecipeGenerator() {
  const [input, setInput] = useState("")
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [retryCount, setRetryCount] = useState(0)
  const { toast } = useToast()

  // Randomly select 4 suggestions on component mount
  useEffect(() => {
    const shuffled = [...SUGGESTIONS].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 4));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsGenerating(true)
    setError("")

    try {
      // Add a delay to give feedback to the user about the generation process
      toast({
        title: "Generating your recipe",
        description: "This may take up to 30 seconds. Please wait...",
      })

      const generatedRecipe = await generateRecipe(input)
      setRecipe(generatedRecipe)

      // Scroll to recipe after generation
      setTimeout(() => {
        const recipeElement = document.getElementById("recipe-result")
        if (recipeElement) {
          recipeElement.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    } catch (err) {
      console.error("Error generating recipe:", err)
      setError("Failed to generate recipe. Please try again.")
      toast({
        title: "Error generating recipe",
        description: "Please try again with different ingredients or preferences.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Auto-submit after a short delay
    setTimeout(() => {
      const form = document.getElementById('recipe-form') as HTMLFormElement;
      if (form) form.requestSubmit();
    }, 100);
  };

  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  const handleSaveRecipe = () => {
    if (!recipe) return

    // Get existing saved recipes from localStorage
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]")

    // Add current recipe if not already saved
    if (!savedRecipes.some((r: Recipe) => r.name === recipe.name)) {
      savedRecipes.push(recipe)
      localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes))
      toast({
        title: "Recipe saved!",
        description: "You can find it in your saved recipes tab.",
      })
    } else {
      toast({
        title: "Recipe already saved",
        description: "This recipe is already in your collection.",
      })
    }
  }

  const handleShareRecipe = () => {
    if (!recipe) return

    if (navigator.share) {
      navigator
        .share({
          title: recipe.name,
          text: `Check out this recipe for ${recipe.name}!`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
        })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied to clipboard!",
        description: "You can now share this recipe with others.",
      })
    }
  }

  return (
    <div id="recipe-generator" className="space-y-6">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="create" className="text-lg py-3">
            Create Recipe
          </TabsTrigger>
          <TabsTrigger value="saved" className="text-lg py-3">
            Saved Recipes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card className="p-6 shadow-xl border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="flex items-center gap-3 mb-4">
              <ChefHat className="h-8 w-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-amber-800">Recipe Generator</h2>
            </div>

            <form id="recipe-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="recipe-input" className="block text-lg font-medium text-amber-800 mb-2">
                  What would you like to cook today?
                </label>
                <Textarea
                  id="recipe-input"
                  placeholder="e.g., 'I have eggs, spinach, and cheese' or 'I want a vegan Italian dinner' or 'Something quick with chicken and rice'"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[120px] text-base border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  disabled={isGenerating}
                />
              </div>
              
              {/* Quick suggestion buttons */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-amber-700">Try one of these suggestions:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm hover:bg-amber-200 transition-colors"
                      disabled={isGenerating}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-6"
                disabled={isGenerating || !input.trim()}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Creating your perfect recipe... {retryCount > 0 ? `(Attempt ${retryCount + 1})` : ''}</span>
                  </div>
                ) : (
                  "Generate Recipe"
                )}
              </Button>
            </form>
          </Card>

          {error && (
            <div className="p-4 bg-red-50 rounded-md border border-red-200 space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <Info className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium text-red-800">{error}</h3>
                  <p className="text-sm text-red-700 mt-1">
                    Our recipe AI encountered an issue. Please try again or use a different query.
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleRetry} 
                className="bg-red-600 hover:bg-red-700"
                disabled={isGenerating}
              >
                Try Again
              </Button>
            </div>
          )}

          {isGenerating && !recipe && (
            <div className="space-y-6 animate-pulse">
              <Card className="shadow-xl overflow-hidden border-amber-200">
                <div className="relative h-64 w-full">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <Skeleton className="h-8 w-3/4 mb-3" />
                    <div className="flex gap-2 mb-4">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-32" />
                      <div className="space-y-3">
                        {Array(6).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-4 w-full" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-32" />
                      <div className="space-y-3">
                        {Array(6).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-4 w-full" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {recipe && !isGenerating && (
            <div id="recipe-result" className="space-y-4 animate-in fade-in-50 duration-500">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleSaveRecipe}
                  className="flex items-center gap-1 border-amber-300 hover:bg-amber-100"
                >
                  <BookmarkPlus className="h-4 w-4" />
                  Save Recipe
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShareRecipe}
                  className="flex items-center gap-1 border-amber-300 hover:bg-amber-100"
                >
                  <Share2 className="h-4 w-4" />
                  Share Recipe
                </Button>
              </div>
              <RecipeDisplay recipe={recipe} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved">
          <SavedRecipes />
        </TabsContent>
      </Tabs>
    </div>
  )
}
