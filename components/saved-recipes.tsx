"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import RecipeDisplay from "./recipe-display"
import { useToast } from "@/components/ui/use-toast"
import type { Recipe } from "@/lib/server-actions"

export default function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load saved recipes from localStorage
    const recipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]") as Recipe[]
    setSavedRecipes(recipes)
  }, [])

  const handleDeleteRecipe = (index: number) => {
    const updatedRecipes = [...savedRecipes]
    updatedRecipes.splice(index, 1)
    setSavedRecipes(updatedRecipes)
    localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes))

    // If the deleted recipe was selected, clear selection
    if (selectedRecipe && selectedRecipe === savedRecipes[index]) {
      setSelectedRecipe(null)
    }

    toast({
      title: "Recipe deleted",
      description: "The recipe has been removed from your saved collection.",
    })
  }

  if (savedRecipes.length === 0) {
    return (
      <Card className="p-8 text-center border-amber-200">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <Trash2 className="h-8 w-8 text-amber-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-amber-800">No Saved Recipes</h3>
        <p className="text-amber-700 mb-4">
          You haven't saved any recipes yet. Generate a recipe and click "Save Recipe" to add it to your collection.
        </p>
        <Button
          className="bg-amber-600 hover:bg-amber-700"
          onClick={() => {
            const createTab = document.querySelector('[data-value="create"]') as HTMLElement;
            if (createTab) createTab.click();
          }}
        >
          Create a Recipe
        </Button>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <h3 className="text-xl font-semibold mb-4 text-amber-800">Your Saved Recipes</h3>
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {savedRecipes.map((recipe, index) => (
            <Card
              key={index}
              className={`border cursor-pointer transition-all ${
                selectedRecipe === recipe ? "border-amber-500 bg-amber-50" : "border-amber-200 hover:border-amber-300"
              }`}
              onClick={() => setSelectedRecipe(recipe)}
            >
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-amber-900">{recipe.name}</h4>
                  <div className="text-sm text-amber-700 mt-1">
                    {recipe.tags.slice(0, 2).join(", ")}
                    {recipe.tags.length > 2 && "..."}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-amber-700 hover:text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteRecipe(index)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="md:col-span-2">
        {selectedRecipe ? (
          <RecipeDisplay recipe={selectedRecipe} />
        ) : (
          <Card className="h-full flex items-center justify-center p-8 border-dashed border-2 border-amber-200 bg-amber-50/50">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2 text-amber-800">Select a Recipe</h3>
              <p className="text-amber-700">Click on a recipe from your saved collection to view its details.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
