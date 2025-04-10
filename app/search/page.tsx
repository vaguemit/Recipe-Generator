"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ChefHat, AlertTriangle, RefreshCw } from "lucide-react"
import { generateRecipe, type Recipe } from "@/lib/server-actions"
import RecipeDisplay from "@/components/recipe-display"
import { Tag } from "@/components/ui/tag"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  
  const [isLoading, setIsLoading] = useState(true)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    if (!query) {
      setIsLoading(false)
      return
    }

    async function searchRecipes() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Add a notification for long operations
        if (retryCount === 0) {
          toast({
            title: "Searching for recipes",
            description: "This may take up to 30 seconds. Please wait...",
          })
        }

        // Generate a recipe based on the search query
        const recipe = await generateRecipe(query)
        
        // In a real app, we would fetch multiple recipes from a database
        // For now, we'll simulate having more recipes by creating variations
        const variations: Recipe[] = [
          recipe,
          {
            ...recipe,
            name: `${recipe.name} (Quick Version)`,
            cookingTime: `${Math.max(5, parseInt(recipe.cookingTime.split(" ")[0]) / 2)} minutes`,
            difficulty: "Easy"
          },
          {
            ...recipe,
            name: `${recipe.name} (Spicy Version)`,
            tags: [...recipe.tags, "Spicy"],
            ingredients: [...recipe.ingredients, "2 tsp red pepper flakes", "1 diced jalapeño pepper"]
          }
        ]
        
        setRecipes(variations)
        setSelectedRecipe(variations[0])
      } catch (err) {
        console.error("Error searching recipes:", err)
        setError("Failed to search recipes. Please try again.")
        toast({
          title: "Error finding recipes",
          description: "Please try a different search term or try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    searchRecipes()
  }, [query, retryCount, toast])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
  }

  const handleNewSearch = () => {
    // Reset state and redirect to home to try a new search
    setIsLoading(false)
    setError(null)
    setRecipes([])
    setSelectedRecipe(null)
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-amber-800">
          Search Results: <span className="text-amber-600">{query}</span>
        </h1>
        <Link href="/" className="text-amber-600 hover:text-amber-800">
          Back to Home
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-amber-600 animate-spin mb-4" />
          <p className="text-lg text-amber-800">
            Searching for the perfect recipes...
            {retryCount > 0 && <span> (Attempt {retryCount + 1})</span>}
          </p>
          <p className="text-sm text-amber-600 mt-2">This may take up to 30 seconds</p>
        </div>
      ) : error ? (
        <Card className="p-8 text-center border-amber-200 mb-8">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-xl font-semibold mb-2 text-red-800">
            Error Finding Recipes
          </CardTitle>
          <p className="text-red-700 mb-6 max-w-md mx-auto">
            {error} Our recipe AI encountered an issue with your search. Please try again or use different search terms.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={handleRetry}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={handleNewSearch}
              className="border-amber-300 hover:bg-amber-100"
            >
              New Search
            </Button>
          </div>
        </Card>
      ) : recipes.length === 0 ? (
        <Card className="p-8 text-center border-amber-200 mb-8">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <ChefHat className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          <CardTitle className="text-xl font-semibold mb-2 text-amber-800">
            No Recipes Found
          </CardTitle>
          <p className="text-amber-700 mb-4">
            We couldn't find any recipes matching your search. Try different ingredients or a broader search term.
          </p>
          <Link href="/">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Back to Home
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-amber-800">Recipe Matches</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {recipes.map((recipe, index) => (
                <Card
                  key={index}
                  className={`border cursor-pointer transition-all ${
                    selectedRecipe === recipe ? "border-amber-500 bg-amber-50" : "border-amber-200 hover:border-amber-300"
                  }`}
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                        <Image 
                          src={recipe.imageSrc || "/placeholder.svg"} 
                          alt={recipe.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-amber-900">{recipe.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {recipe.tags.slice(0, 2).map((tag, idx) => (
                            <Tag key={idx} variant="secondary" className="bg-amber-500 text-white border-none text-xs">
                              {tag}
                            </Tag>
                          ))}
                          {recipe.tags.length > 2 && (
                            <span className="text-xs text-amber-600">+{recipe.tags.length - 2} more</span>
                          )}
                        </div>
                        <div className="text-sm text-amber-700 mt-1">
                          {recipe.cookingTime} • {recipe.difficulty}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            {selectedRecipe && <RecipeDisplay recipe={selectedRecipe} />}
          </div>
        </div>
      )}
    </div>
  )
} 