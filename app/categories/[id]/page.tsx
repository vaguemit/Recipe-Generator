"use client"

// Categories available:
// - international
// - gluten-free
// - vegetarian
// - healthy
// - quick
// - family
// - breakfast
// - special

import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ChefHat, ArrowLeft, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { categories } from "@/components/recipe-categories"

interface Recipe {
  id: number;
  name: string;
  time: string;
  difficulty: string;
  tags: string[];
  chef: string;
}

interface CategoryRecipes {
  [key: string]: Recipe[];
}

const categoryRecipes: CategoryRecipes = {
  international: [
    {
      id: 1,
      name: "Authentic Italian Pasta Carbonara",
      time: "25 mins",
      difficulty: "Medium",
      tags: ["Italian", "Pasta"],
      chef: "Mario Rossi"
    },
    {
      id: 2,
      name: "Thai Green Curry",
      time: "45 mins",
      difficulty: "Medium",
      tags: ["Thai", "Curry", "Spicy"],
      chef: "Sarah Chen"
    },
    {
      id: 3,
      name: "Classic Spanish Paella",
      time: "60 mins",
      difficulty: "Hard",
      tags: ["Spanish", "Rice", "Seafood"],
      chef: "Carlos Martinez"
    },
    {
      id: 4,
      name: "Japanese Miso Ramen",
      time: "50 mins",
      difficulty: "Medium",
      tags: ["Japanese", "Soup", "Noodles"],
      chef: "Yuki Tanaka"
    }
  ],
  "gluten-free": [
    {
      id: 1,
      name: "Quinoa Buddha Bowl",
      time: "30 mins",
      difficulty: "Easy",
      tags: ["Gluten-Free", "Healthy", "Bowl"],
      chef: "Emma Wilson"
    },
    {
      id: 2,
      name: "Almond Flour Pancakes",
      time: "20 mins",
      difficulty: "Easy",
      tags: ["Breakfast", "Gluten-Free"],
      chef: "David Brown"
    },
    {
      id: 3,
      name: "Gluten-Free Chocolate Brownies",
      time: "40 mins",
      difficulty: "Easy",
      tags: ["Dessert", "Chocolate", "Gluten-Free"],
      chef: "Rebecca Moore"
    },
    {
      id: 4,
      name: "Zucchini Noodle Stir-Fry",
      time: "25 mins",
      difficulty: "Easy",
      tags: ["Asian", "Stir-Fry", "Low-Carb"],
      chef: "Thomas Chang"
    }
  ],
  vegetarian: [
    {
      id: 1,
      name: "Mushroom Risotto",
      time: "45 mins",
      difficulty: "Medium",
      tags: ["Italian", "Rice", "Vegetarian"],
      chef: "Lisa Green"
    },
    {
      id: 2,
      name: "Roasted Vegetable Lasagna",
      time: "60 mins",
      difficulty: "Medium",
      tags: ["Italian", "Pasta", "Vegetarian"],
      chef: "Michael White"
    },
    {
      id: 3,
      name: "Spinach and Feta Stuffed Bell Peppers",
      time: "35 mins",
      difficulty: "Easy",
      tags: ["Greek", "Vegetarian", "Healthy"],
      chef: "Sophia Lewis"
    },
    {
      id: 4,
      name: "Sweet Potato and Black Bean Tacos",
      time: "30 mins",
      difficulty: "Easy",
      tags: ["Mexican", "Tacos", "Vegetarian"],
      chef: "Nina Rodriguez"
    }
  ],
  healthy: [
    {
      id: 1,
      name: "Grilled Salmon with Lemon and Herbs",
      time: "25 mins",
      difficulty: "Easy",
      tags: ["Seafood", "Protein", "Low-Carb"],
      chef: "James Miller"
    },
    {
      id: 2,
      name: "Mediterranean Chickpea Salad",
      time: "15 mins",
      difficulty: "Easy",
      tags: ["Salad", "Protein", "Mediterranean"],
      chef: "Olivia Adams"
    },
    {
      id: 3,
      name: "Baked Chicken with Roasted Vegetables",
      time: "45 mins",
      difficulty: "Medium",
      tags: ["Protein", "One-Pan", "Meal-Prep"],
      chef: "Daniel Parker"
    },
    {
      id: 4,
      name: "Berry Protein Smoothie Bowl",
      time: "10 mins",
      difficulty: "Easy",
      tags: ["Breakfast", "High-Protein", "No-Cook"],
      chef: "Sophia Chen"
    }
  ],
  quick: [
    {
      id: 1,
      name: "15-Minute Shrimp Stir Fry",
      time: "15 mins",
      difficulty: "Easy",
      tags: ["Asian", "Seafood", "Quick"],
      chef: "Andrew Kim"
    },
    {
      id: 2,
      name: "5-Ingredient Pasta Aglio e Olio",
      time: "20 mins",
      difficulty: "Easy",
      tags: ["Italian", "Pasta", "Simple"],
      chef: "Marco Bianchi"
    },
    {
      id: 3,
      name: "Microwave Egg & Veggie Breakfast Mug",
      time: "5 mins",
      difficulty: "Easy",
      tags: ["Breakfast", "Microwave", "One-Mug"],
      chef: "Jessica Taylor"
    },
    {
      id: 4,
      name: "10-Minute Tuna Salad Wrap",
      time: "10 mins",
      difficulty: "Easy",
      tags: ["Lunch", "No-Cook", "High-Protein"],
      chef: "Mark Wilson"
    }
  ],
  family: [
    {
      id: 1,
      name: "Kid-Friendly Chicken Nuggets",
      time: "30 mins",
      difficulty: "Easy",
      tags: ["Kid-Friendly", "Baked", "Protein"],
      chef: "Patricia Johnson"
    },
    {
      id: 2,
      name: "Build-Your-Own Pizza Night",
      time: "45 mins",
      difficulty: "Medium",
      tags: ["Fun", "Family", "Interactive"],
      chef: "Robert Davis"
    },
    {
      id: 3,
      name: "Mac and Cheese with Hidden Vegetables",
      time: "30 mins",
      difficulty: "Easy",
      tags: ["Kid-Friendly", "Pasta", "Comfort"],
      chef: "Angela Martinez"
    },
    {
      id: 4,
      name: "Smiley Face Pancake Breakfast",
      time: "25 mins",
      difficulty: "Easy",
      tags: ["Breakfast", "Fun", "Sweet"],
      chef: "Christopher Lee"
    }
  ],
  breakfast: [
    {
      id: 1,
      name: "Avocado Toast with Poached Eggs",
      time: "15 mins",
      difficulty: "Medium",
      tags: ["Healthy", "Protein", "Trendy"],
      chef: "Hannah Johnson"
    },
    {
      id: 2,
      name: "Fluffy Buttermilk Pancakes",
      time: "25 mins",
      difficulty: "Easy",
      tags: ["Sweet", "Classic", "Weekend"],
      chef: "David Williams"
    },
    {
      id: 3,
      name: "Overnight Chia Pudding",
      time: "5 mins + overnight",
      difficulty: "Easy",
      tags: ["Make-Ahead", "Healthy", "No-Cook"],
      chef: "Michelle Taylor"
    },
    {
      id: 4,
      name: "Breakfast Burrito Meal Prep",
      time: "40 mins",
      difficulty: "Medium",
      tags: ["Meal-Prep", "Freezer-Friendly", "Protein"],
      chef: "Brian Martinez"
    }
  ],
  special: [
    {
      id: 1,
      name: "Beef Wellington",
      time: "2 hours 30 mins",
      difficulty: "Hard",
      tags: ["Special Occasion", "Impressive", "Dinner Party"],
      chef: "Gordon Smith"
    },
    {
      id: 2,
      name: "Triple Chocolate Layer Cake",
      time: "1 hour 30 mins",
      difficulty: "Hard",
      tags: ["Celebration", "Dessert", "Birthday"],
      chef: "Jennifer Adams"
    },
    {
      id: 3,
      name: "Prosciutto-Wrapped Asparagus",
      time: "20 mins",
      difficulty: "Easy",
      tags: ["Appetizer", "Elegant", "Party"],
      chef: "Caroline Dubois"
    },
    {
      id: 4,
      name: "Lobster Thermidor",
      time: "1 hour 15 mins",
      difficulty: "Hard",
      tags: ["Seafood", "Luxury", "Holiday"],
      chef: "Richard Palmer"
    }
  ]
};

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.id as string
  const category = categories.find(cat => cat.id === categoryId)
  const recipes = categoryRecipes[categoryId] || []

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-800 mb-4">Category not found</h1>
          <Link href="/">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const Icon = category.icon

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-amber-600 hover:text-amber-800 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Link>
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-lg ${category.color} text-white flex items-center justify-center`}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-amber-800">{category.name}</h1>
            <p className="text-amber-600">{category.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {category.subcategories.map((sub: string) => (
            <Badge
              key={sub}
              variant="outline"
              className="bg-amber-50 border-amber-200 text-amber-700"
            >
              {sub}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map((recipe: Recipe) => (
          <Card key={recipe.id} className="border-amber-200 hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${category.color} text-white flex items-center justify-center flex-shrink-0`}>
                  <Utensils className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-amber-800 mb-2">{recipe.name}</h2>
                  <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-amber-700">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChefHat className="h-4 w-4" />
                      <span>{recipe.chef}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-50 rounded-full text-xs">
                      {recipe.difficulty}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-amber-50 border-amber-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recipes.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-amber-800 mb-2">No Recipes Yet</h2>
          <p className="text-amber-600">
            We're cooking up some delicious recipes for this category. Check back soon!
          </p>
        </div>
      )}
    </div>
  )
} 