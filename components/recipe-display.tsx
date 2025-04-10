import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Clock, ChefHat, Utensils, Flame, Heart } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Recipe } from "@/lib/server-actions"
import { Tag } from "@/components/ui/tag"

interface RecipeDisplayProps {
  recipe: Recipe
}

export default function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  if (!recipe) return null

  // Use the provided image or generate a placeholder
  const imageUrl = recipe.imageSrc || `https://source.unsplash.com/featured/?food,${encodeURIComponent(recipe.name.toLowerCase().replace(/[^a-z0-9]/g, ','))},recipe`

  return (
    <Card className="shadow-xl overflow-hidden border-amber-200">
      <div className="relative h-64 w-full">
        <Image src={imageUrl} alt={recipe.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 w-full">
            <div className="flex flex-wrap gap-2 mb-2">
              {recipe.tags.map((tag, index) => (
                <Tag key={index} variant="secondary" className="bg-amber-500 text-white border-none">
                  {tag}
                </Tag>
              ))}
            </div>
            <h2 className="text-3xl font-bold text-white">{recipe.name}</h2>
          </div>
        </div>
      </div>

      <CardHeader className="bg-amber-100 pb-2">
        <div className="flex flex-wrap gap-6 justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" />
            <div>
              <div className="text-xs text-amber-700">Cooking Time</div>
              <div className="font-semibold">{recipe.cookingTime}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-600" />
            <div>
              <div className="text-xs text-amber-700">Difficulty</div>
              <div className="font-semibold">{recipe.difficulty}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-amber-600" />
            <div>
              <div className="text-xs text-amber-700">Servings</div>
              <div className="font-semibold">{recipe.servings}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-amber-600" />
            <div>
              <div className="text-xs text-amber-700">Calories</div>
              <div className="font-semibold">{recipe.nutritionalInfo.calories}</div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-amber-800 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-800">
                1
              </span>
              Ingredients
            </h3>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="inline-block w-5 h-5 rounded-full border-2 border-amber-400 flex-shrink-0 mt-0.5"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-amber-800 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-800">
                2
              </span>
              Instructions
            </h3>
            <ol className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-sm flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {recipe.nutritionalInfo && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-amber-800 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-800">
                3
              </span>
              Nutritional Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(recipe.nutritionalInfo).map(([key, value]) => (
                <div key={key} className="bg-amber-50 p-4 rounded-lg text-center border border-amber-100 shadow-sm">
                  <div className="text-sm text-amber-700 mb-1 capitalize">{key}</div>
                  <div className="font-semibold text-lg">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recipe.tips && recipe.tips.length > 0 && (
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
            <h3 className="text-xl font-semibold mb-3 text-amber-800">Chef's Tips</h3>
            <ul className="space-y-2">
              {recipe.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ChefHat className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
