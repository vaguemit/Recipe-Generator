"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Search, Filter } from "lucide-react"
import { generateRecipe } from "@/lib/server-actions"
import RecipeDisplay from "@/components/recipe-display"
import { useToast } from "@/components/ui/use-toast"

export default function AdvancedSearchPage() {
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const { toast } = useToast()

  // Search filters
  const [filters, setFilters] = useState({
    query: "",
    ingredients: {
      include: "",
      exclude: "",
    },
    dietary: [],
    cuisineType: "",
    mealType: "",
    cookingTime: [60],
    difficulty: "",
    calories: [500],
  })

  const dietaryOptions = [
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
    { id: "gluten-free", label: "Gluten-Free" },
    { id: "dairy-free", label: "Dairy-Free" },
    { id: "keto", label: "Keto" },
    { id: "low-carb", label: "Low Carb" },
    { id: "paleo", label: "Paleo" },
  ]

  const cuisineOptions = [
    "Any",
    "Italian",
    "Mexican",
    "Chinese",
    "Japanese",
    "Indian",
    "Thai",
    "Mediterranean",
    "American",
    "French",
    "Middle Eastern",
  ]

  const mealTypeOptions = ["Any", "Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Appetizer"]

  const difficultyOptions = ["Any", "Easy", "Medium", "Hard"]

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFilters({
        ...filters,
        [parent]: {
          ...filters[parent],
          [child]: value,
        },
      })
    } else {
      setFilters({
        ...filters,
        [name]: value,
      })
    }
  }

  const handleCheckboxChange = (id) => {
    setFilters({
      ...filters,
      dietary: filters.dietary.includes(id) ? filters.dietary.filter((item) => item !== id) : [...filters.dietary, id],
    })
  }

  const handleSliderChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const handleSearch = async () => {
    setIsSearching(true)

    try {
      // In a real app, this would search a database of recipes
      // For demo purposes, we'll generate a few recipes based on the filters

      // Build search prompt from filters
      const prompt = `
        Generate a recipe that matches these criteria:
        ${filters.query ? `Recipe should be related to: ${filters.query}` : ""}
        ${filters.ingredients.include ? `Must include these ingredients: ${filters.ingredients.include}` : ""}
        ${filters.ingredients.exclude ? `Must NOT include these ingredients: ${filters.ingredients.exclude}` : ""}
        ${filters.dietary.length > 0 ? `Dietary restrictions: ${filters.dietary.join(", ")}` : ""}
        ${filters.cuisineType && filters.cuisineType !== "Any" ? `Cuisine type: ${filters.cuisineType}` : ""}
        ${filters.mealType && filters.mealType !== "Any" ? `Meal type: ${filters.mealType}` : ""}
        ${filters.cookingTime ? `Maximum cooking time: ${filters.cookingTime} minutes` : ""}
        ${filters.difficulty && filters.difficulty !== "Any" ? `Difficulty level: ${filters.difficulty}` : ""}
        ${filters.calories ? `Maximum calories per serving: ${filters.calories} calories` : ""}
      `

      // Generate 3 recipes for demo purposes
      const results = []
      for (let i = 0; i < 3; i++) {
        const recipe = await generateRecipe(prompt)
        results.push(recipe)
      }

      setSearchResults(results)

      toast({
        title: "Search complete",
        description: `Found ${results.length} recipes matching your criteria`,
      })
    } catch (err) {
      console.error("Error searching recipes:", err)
      toast({
        variant: "destructive",
        title: "Error searching recipes",
        description: "Please try again with different criteria",
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-amber-800">Advanced Recipe Search</h1>
        <p className="text-amber-600">Find the perfect recipe with our powerful search filters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="border-amber-200 sticky top-24">
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Search Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div>
                <Label htmlFor="query" className="text-amber-700 mb-1 block">
                  Search Term
                </Label>
                <Input
                  id="query"
                  name="query"
                  placeholder="e.g., pasta, curry, chocolate cake"
                  value={filters.query}
                  onChange={handleInputChange}
                  className="border-amber-200"
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-amber-800">Ingredients</h3>
                <div>
                  <Label htmlFor="ingredients.include" className="text-amber-700 text-sm mb-1 block">
                    Must Include
                  </Label>
                  <Input
                    id="ingredients.include"
                    name="ingredients.include"
                    placeholder="e.g., chicken, tomatoes"
                    value={filters.ingredients.include}
                    onChange={handleInputChange}
                    className="border-amber-200"
                  />
                </div>
                <div>
                  <Label htmlFor="ingredients.exclude" className="text-amber-700 text-sm mb-1 block">
                    Must Exclude
                  </Label>
                  <Input
                    id="ingredients.exclude"
                    name="ingredients.exclude"
                    placeholder="e.g., nuts, shellfish"
                    value={filters.ingredients.exclude}
                    onChange={handleInputChange}
                    className="border-amber-200"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-medium text-amber-800 mb-2">Dietary Restrictions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {dietaryOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={filters.dietary.includes(option.id)}
                        onCheckedChange={() => handleCheckboxChange(option.id)}
                      />
                      <Label htmlFor={option.id} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cuisineType" className="text-amber-700 mb-1 block">
                    Cuisine
                  </Label>
                  <select
                    id="cuisineType"
                    name="cuisineType"
                    value={filters.cuisineType}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-amber-200 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  >
                    {cuisineOptions.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>
                        {cuisine}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="mealType" className="text-amber-700 mb-1 block">
                    Meal Type
                  </Label>
                  <select
                    id="mealType"
                    name="mealType"
                    value={filters.mealType}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-amber-200 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  >
                    {mealTypeOptions.map((meal) => (
                      <option key={meal} value={meal}>
                        {meal}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <Label htmlFor="cookingTime" className="text-amber-700">
                    Max Cooking Time
                  </Label>
                  <span className="text-sm text-amber-600">{filters.cookingTime} min</span>
                </div>
                <Slider
                  id="cookingTime"
                  min={15}
                  max={180}
                  step={15}
                  value={filters.cookingTime}
                  onValueChange={(value) => handleSliderChange("cookingTime", value)}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-amber-500">
                  <span>15 min</span>
                  <span>3 hours</span>
                </div>
              </div>

              <div>
                <Label htmlFor="difficulty" className="text-amber-700 mb-1 block">
                  Difficulty
                </Label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={filters.difficulty}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-amber-200 rounded-md focus:ring-amber-500 focus:border-amber-500"
                >
                  {difficultyOptions.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <Label htmlFor="calories" className="text-amber-700">
                    Max Calories (per serving)
                  </Label>
                  <span className="text-sm text-amber-600">{filters.calories} cal</span>
                </div>
                <Slider
                  id="calories"
                  min={100}
                  max={1000}
                  step={50}
                  value={filters.calories}
                  onValueChange={(value) => handleSliderChange("calories", value)}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-amber-500">
                  <span>100 cal</span>
                  <span>1000 cal</span>
                </div>
              </div>

              <Button onClick={handleSearch} disabled={isSearching} className="w-full bg-amber-600 hover:bg-amber-700">
                {isSearching ? (
                  <>Searching...</>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Recipes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-8">
            {isSearching ? (
              <Card className="border-amber-200 p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600 mb-4"></div>
                  <p className="text-amber-800 font-medium">Searching for the perfect recipes...</p>
                  <p className="text-amber-600 text-sm mt-2">This may take a moment</p>
                </div>
              </Card>
            ) : searchResults.length > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-amber-800">Search Results ({searchResults.length})</h2>
                  <Button
                    variant="outline"
                    className="border-amber-200 hover:bg-amber-100"
                    onClick={() => setSearchResults([])}
                  >
                    Clear Results
                  </Button>
                </div>

                {searchResults.map((recipe, index) => (
                  <div key={index} className="mb-8">
                    <RecipeDisplay recipe={recipe} />
                  </div>
                ))}
              </>
            ) : (
              <Card className="border-amber-200 p-12">
                <div className="text-center">
                  <Search className="h-16 w-16 text-amber-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-amber-800 mb-2">Find Your Perfect Recipe</h2>
                  <p className="text-amber-600 max-w-md mx-auto">
                    Use the filters to search for recipes that match your ingredients, dietary preferences, and more.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
