"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, ShoppingCart, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function MealPlannerPage() {
  const [currentWeek, setCurrentWeek] = useState(getWeekDates())
  const [mealPlan, setMealPlan] = useState({})
  const { toast } = useToast()

  // Load meal plan from localStorage on component mount
  useEffect(() => {
    const savedMealPlan = localStorage.getItem("mealPlan")
    if (savedMealPlan) {
      setMealPlan(JSON.parse(savedMealPlan))
    }
  }, [])

  // Save meal plan to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("mealPlan", JSON.stringify(mealPlan))
  }, [mealPlan])

  function getWeekDates(date = new Date()) {
    const day = date.getDay() // 0 is Sunday
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust to get Monday

    const monday = new Date(date)
    monday.setDate(diff)

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(monday)
      currentDate.setDate(monday.getDate() + i)
      weekDates.push(currentDate)
    }

    return weekDates
  }

  function formatDate(date) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  function getFullDate(date) {
    return date.toISOString().split("T")[0]
  }

  function navigateWeek(direction) {
    const firstDay = new Date(currentWeek[0])
    const daysToAdd = direction === "next" ? 7 : -7
    firstDay.setDate(firstDay.getDate() + daysToAdd)
    setCurrentWeek(getWeekDates(firstDay))
  }

  function addRecipeToMealPlan(date, mealType) {
    // In a real app, this would open a modal to select a recipe
    // For now, we'll just add a placeholder recipe
    const fullDate = getFullDate(date)

    // Get saved recipes from localStorage
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]")

    if (savedRecipes.length === 0) {
      toast({
        title: "No saved recipes",
        description: "Save some recipes first to add them to your meal plan.",
        variant: "destructive",
      })
      return
    }

    // For demo purposes, just pick a random recipe from saved recipes
    const randomRecipe = savedRecipes[Math.floor(Math.random() * savedRecipes.length)]

    setMealPlan((prev) => {
      const newPlan = { ...prev }
      if (!newPlan[fullDate]) {
        newPlan[fullDate] = {}
      }
      if (!newPlan[fullDate][mealType]) {
        newPlan[fullDate][mealType] = []
      }

      // Check if recipe is already in the meal plan
      const isAlreadyAdded = newPlan[fullDate][mealType].some((recipe) => recipe.name === randomRecipe.name)

      if (!isAlreadyAdded) {
        newPlan[fullDate][mealType] = [...newPlan[fullDate][mealType], randomRecipe]

        toast({
          title: "Recipe added",
          description: `Added ${randomRecipe.name} to ${mealType} on ${formatDate(date)}`,
        })
      } else {
        toast({
          title: "Recipe already added",
          description: `${randomRecipe.name} is already in your meal plan for this day`,
        })
      }

      return newPlan
    })
  }

  function removeRecipeFromMealPlan(date, mealType, recipeName) {
    const fullDate = getFullDate(date)

    setMealPlan((prev) => {
      const newPlan = { ...prev }
      if (newPlan[fullDate] && newPlan[fullDate][mealType]) {
        newPlan[fullDate][mealType] = newPlan[fullDate][mealType].filter((recipe) => recipe.name !== recipeName)

        // Clean up empty arrays and objects
        if (newPlan[fullDate][mealType].length === 0) {
          delete newPlan[fullDate][mealType]
        }
        if (Object.keys(newPlan[fullDate]).length === 0) {
          delete newPlan[fullDate]
        }
      }
      return newPlan
    })

    toast({
      title: "Recipe removed",
      description: `Removed ${recipeName} from your meal plan`,
    })
  }

  function generateShoppingList() {
    // Extract all ingredients from the meal plan
    const allIngredients = []

    Object.values(mealPlan).forEach((dayPlan) => {
      Object.values(dayPlan).forEach((mealTypeRecipes) => {
        mealTypeRecipes.forEach((recipe) => {
          if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
            allIngredients.push(...recipe.ingredients)
          }
        })
      })
    })

    // Save to localStorage for the shopping list page
    localStorage.setItem("shoppingList", JSON.stringify(allIngredients))

    toast({
      title: "Shopping list generated",
      description: "Your shopping list is ready to view",
    })

    // Navigate to shopping list page
    window.location.href = "/shopping-list"
  }

  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"]
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-800">Weekly Meal Planner</h1>
          <p className="text-amber-600">Plan your meals for the week ahead</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-amber-200 hover:bg-amber-100"
            onClick={() => navigateWeek("prev")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous Week
          </Button>
          <Button
            variant="outline"
            className="border-amber-200 hover:bg-amber-100"
            onClick={() => navigateWeek("next")}
          >
            Next Week
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700 flex items-center gap-1" onClick={generateShoppingList}>
            <ShoppingCart className="h-4 w-4" />
            Generate Shopping List
          </Button>
        </div>
      </div>

      <Card className="border-amber-200 mb-8">
        <CardHeader className="bg-amber-50 border-b border-amber-100">
          <div className="grid grid-cols-8 gap-2">
            <div className="col-span-1"></div>
            {currentWeek.map((date, index) => (
              <div key={index} className="col-span-1 text-center">
                <p className="font-medium text-amber-800">{dayNames[index]}</p>
                <p className="text-amber-600 text-sm">{formatDate(date)}</p>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {mealTypes.map((mealType) => (
            <div key={mealType} className="grid grid-cols-8 gap-2 mb-6 last:mb-0">
              <div className="col-span-1 flex items-center">
                <p className="font-medium text-amber-800">{mealType}</p>
              </div>

              {currentWeek.map((date, index) => {
                const fullDate = getFullDate(date)
                const recipes = mealPlan[fullDate]?.[mealType] || []

                return (
                  <div
                    key={index}
                    className="col-span-1 min-h-[100px] border border-dashed border-amber-200 rounded-md p-2 bg-amber-50/50"
                  >
                    {recipes.length > 0 ? (
                      <div className="space-y-2">
                        {recipes.map((recipe, recipeIndex) => (
                          <div key={recipeIndex} className="bg-white p-2 rounded-md shadow-sm text-sm">
                            <div className="font-medium text-amber-800 line-clamp-2">{recipe.name}</div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-amber-600">{recipe.cookingTime}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-amber-600 hover:text-red-600 hover:bg-red-50"
                                onClick={() => removeRecipeFromMealPlan(date, mealType, recipe.name)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        className="w-full h-full flex flex-col items-center justify-center text-amber-400 hover:text-amber-600 hover:bg-amber-100/50"
                        onClick={() => addRecipeToMealPlan(date, mealType)}
                      >
                        <PlusCircle className="h-5 w-5 mb-1" />
                        <span className="text-xs">Add Recipe</span>
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
        <h2 className="text-lg font-medium text-amber-800 mb-2">Tips for Meal Planning</h2>
        <ul className="list-disc list-inside space-y-1 text-amber-700">
          <li>Plan your meals around your schedule - quick meals for busy days</li>
          <li>Try to incorporate leftovers to reduce food waste</li>
          <li>Aim for a balance of proteins, carbs, and vegetables</li>
          <li>Prep ingredients in advance for faster cooking during the week</li>
          <li>Generate a shopping list once your plan is complete</li>
        </ul>
      </div>
    </div>
  )
}
