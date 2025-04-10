"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { generateRecipe } from "@/lib/server-actions"
import RecipeDisplay from "./recipe-display"
import { useToast } from "@/components/ui/use-toast"

export default function StepByStepGuide() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [recipe, setRecipe] = useState(null)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    ingredients: "",
    dietaryPreferences: [],
    cuisineType: "",
    mealType: "",
    cookingTime: "",
    skillLevel: "",
    servingSize: "2",
    additionalNotes: "",
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

  const mealTypeOptions = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Appetizer"]

  const cookingTimeOptions = ["Quick (under 30 min)", "Medium (30-60 min)", "Long (over 60 min)"]

  const skillLevelOptions = ["Beginner", "Intermediate", "Advanced"]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCheckboxChange = (id) => {
    setFormData({
      ...formData,
      dietaryPreferences: formData.dietaryPreferences.includes(id)
        ? formData.dietaryPreferences.filter((item) => item !== id)
        : [...formData.dietaryPreferences, id],
    })
  }

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleGenerateRecipe = async () => {
    setIsGenerating(true)

    try {
      // Build prompt from form data
      const prompt = `
        Create a recipe with these ingredients: ${formData.ingredients}.
        ${formData.dietaryPreferences.length > 0 ? `Dietary preferences: ${formData.dietaryPreferences.join(", ")}.` : ""}
        ${formData.cuisineType ? `Cuisine type: ${formData.cuisineType}.` : ""}
        ${formData.mealType ? `Meal type: ${formData.mealType}.` : ""}
        ${formData.cookingTime ? `Cooking time: ${formData.cookingTime}.` : ""}
        ${formData.skillLevel ? `Skill level: ${formData.skillLevel}.` : ""}
        Serving size: ${formData.servingSize} people.
        ${formData.additionalNotes ? `Additional notes: ${formData.additionalNotes}.` : ""}
      `

      const generatedRecipe = await generateRecipe(prompt)
      setRecipe(generatedRecipe)
      setCurrentStep(5) // Move to final step

      toast({
        title: "Recipe generated!",
        description: "Your personalized recipe is ready.",
      })
    } catch (err) {
      console.error("Error generating recipe:", err)
      toast({
        variant: "destructive",
        title: "Error generating recipe",
        description: "Please try again with different inputs.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveRecipe = () => {
    if (!recipe) return

    // Get existing saved recipes from localStorage
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]")

    // Add current recipe if not already saved
    if (!savedRecipes.some((r) => r.name === recipe.name)) {
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-amber-800 mb-2">Step 1: Ingredients & Dietary Preferences</h3>
            <div>
              <Label htmlFor="ingredients" className="text-amber-700">
                What ingredients do you have?
              </Label>
              <Textarea
                id="ingredients"
                name="ingredients"
                placeholder="e.g., chicken, rice, bell peppers, onions"
                value={formData.ingredients}
                onChange={handleInputChange}
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div>
              <p className="text-amber-700 mb-2">Dietary Preferences (optional)</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {dietaryOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={formData.dietaryPreferences.includes(option.id)}
                      onCheckedChange={() => handleCheckboxChange(option.id)}
                    />
                    <Label htmlFor={option.id} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-amber-800 mb-2">Step 2: Cuisine & Meal Type</h3>

            <div>
              <Label htmlFor="cuisineType" className="text-amber-700">
                Cuisine Type (optional)
              </Label>
              <select
                id="cuisineType"
                name="cuisineType"
                value={formData.cuisineType}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-amber-200 rounded-md focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Select cuisine type</option>
                {cuisineOptions.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="mealType" className="text-amber-700">
                Meal Type (optional)
              </Label>
              <select
                id="mealType"
                name="mealType"
                value={formData.mealType}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-amber-200 rounded-md focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Select meal type</option>
                {mealTypeOptions.map((meal) => (
                  <option key={meal} value={meal}>
                    {meal}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-amber-800 mb-2">Step 3: Cooking Details</h3>

            <div>
              <Label htmlFor="cookingTime" className="text-amber-700">
                Cooking Time (optional)
              </Label>
              <select
                id="cookingTime"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-amber-200 rounded-md focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Select cooking time</option>
                {cookingTimeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="skillLevel" className="text-amber-700">
                Skill Level (optional)
              </Label>
              <select
                id="skillLevel"
                name="skillLevel"
                value={formData.skillLevel}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-amber-200 rounded-md focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Select skill level</option>
                {skillLevelOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="servingSize" className="text-amber-700">
                Serving Size
              </Label>
              <Input
                id="servingSize"
                name="servingSize"
                type="number"
                min="1"
                max="12"
                value={formData.servingSize}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-amber-800 mb-2">Step 4: Additional Notes</h3>

            <div>
              <Label htmlFor="additionalNotes" className="text-amber-700">
                Any additional preferences or notes?
              </Label>
              <Textarea
                id="additionalNotes"
                name="additionalNotes"
                placeholder="e.g., spicy, kid-friendly, low sodium, etc."
                value={formData.additionalNotes}
                onChange={handleInputChange}
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <h4 className="font-medium text-amber-800 mb-2">Recipe Summary</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <span className="font-medium">Ingredients:</span> {formData.ingredients || "Not specified"}
                </li>
                <li>
                  <span className="font-medium">Dietary Preferences:</span>{" "}
                  {formData.dietaryPreferences.length > 0 ? formData.dietaryPreferences.join(", ") : "None"}
                </li>
                <li>
                  <span className="font-medium">Cuisine Type:</span> {formData.cuisineType || "Any"}
                </li>
                <li>
                  <span className="font-medium">Meal Type:</span> {formData.mealType || "Any"}
                </li>
                <li>
                  <span className="font-medium">Cooking Time:</span> {formData.cookingTime || "Any"}
                </li>
                <li>
                  <span className="font-medium">Skill Level:</span> {formData.skillLevel || "Any"}
                </li>
                <li>
                  <span className="font-medium">Serving Size:</span> {formData.servingSize} people
                </li>
              </ul>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-amber-800 mb-2">Your Personalized Recipe</h3>

            {recipe ? (
              <div className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleSaveRecipe} className="border-amber-300 hover:bg-amber-100">
                    Save Recipe
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Reset form and go back to step 1
                      setFormData({
                        ingredients: "",
                        dietaryPreferences: [],
                        cuisineType: "",
                        mealType: "",
                        cookingTime: "",
                        skillLevel: "",
                        servingSize: "2",
                        additionalNotes: "",
                      })
                      setRecipe(null)
                      setCurrentStep(1)
                    }}
                    className="border-amber-300 hover:bg-amber-100"
                  >
                    Create New Recipe
                  </Button>
                </div>
                <RecipeDisplay recipe={recipe} />
              </div>
            ) : (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const renderProgressBar = () => {
    return (
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {["Ingredients", "Cuisine", "Details", "Notes", "Recipe"].map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                currentStep > index + 1
                  ? "text-amber-600"
                  : currentStep === index + 1
                    ? "text-amber-800 font-medium"
                    : "text-amber-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  currentStep > index + 1
                    ? "bg-amber-600 text-white"
                    : currentStep === index + 1
                      ? "bg-amber-100 border-2 border-amber-600 text-amber-800"
                      : "bg-amber-100 text-amber-400"
                }`}
              >
                {currentStep > index + 1 ? <Check className="h-5 w-5" /> : index + 1}
              </div>
              <span className="text-xs hidden sm:block">{step}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-amber-100 rounded-full h-2.5">
          <div
            className="bg-amber-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep - 1) * 25}%` }}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-amber-200 shadow-lg">
      <CardContent className="p-6">
        {renderProgressBar()}

        {renderStepContent()}

        <div className="flex justify-between mt-6">
          {currentStep > 1 && currentStep !== 5 && (
            <Button variant="outline" onClick={prevStep} className="border-amber-300 hover:bg-amber-100">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}

          {currentStep < 4 && (
            <Button onClick={nextStep} className="ml-auto bg-amber-600 hover:bg-amber-700">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}

          {currentStep === 4 && (
            <Button
              onClick={handleGenerateRecipe}
              disabled={isGenerating || !formData.ingredients.trim()}
              className="ml-auto bg-amber-600 hover:bg-amber-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Recipe
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
