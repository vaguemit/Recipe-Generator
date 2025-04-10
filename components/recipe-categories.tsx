"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Globe2,
  Wheat,
  Leaf,
  Heart,
  Timer,
  Baby,
  Coffee,
  UtensilsCrossed,
  LucideIcon,
} from "lucide-react"

interface Category {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  subcategories: string[];
  color: string;
}

export const categories: Category[] = [
  {
    id: "international",
    name: "International Cuisine",
    description: "Explore dishes from around the world",
    icon: Globe2,
    subcategories: ["Italian", "Asian", "Mexican", "Mediterranean", "Indian"],
    color: "bg-blue-500",
  },
  {
    id: "gluten-free",
    name: "Gluten-Free",
    description: "Delicious recipes without gluten",
    icon: Wheat,
    subcategories: ["Breads", "Pasta", "Desserts", "Snacks"],
    color: "bg-amber-500",
  },
  {
    id: "vegetarian",
    name: "Vegetarian",
    description: "Plant-based goodness",
    icon: Leaf,
    subcategories: ["Mains", "Salads", "Soups", "Sides"],
    color: "bg-green-500",
  },
  {
    id: "healthy",
    name: "Healthy",
    description: "Nutritious and balanced meals",
    icon: Heart,
    subcategories: ["Low-Calorie", "High-Protein", "Low-Carb", "Superfoods"],
    color: "bg-red-500",
  },
  {
    id: "quick",
    name: "Quick & Easy",
    description: "30 minutes or less recipes",
    icon: Timer,
    subcategories: ["5-Ingredient", "One-Pot", "No-Cook", "Make-Ahead"],
    color: "bg-purple-500",
  },
  {
    id: "family",
    name: "Family-Friendly",
    description: "Kid-approved recipes",
    icon: Baby,
    subcategories: ["Lunch Box", "After School", "Weekend Fun", "Party Food"],
    color: "bg-pink-500",
  },
  {
    id: "breakfast",
    name: "Breakfast & Brunch",
    description: "Start your day right",
    icon: Coffee,
    subcategories: ["Quick Breakfast", "Eggs", "Pancakes", "Smoothies"],
    color: "bg-orange-500",
  },
  {
    id: "special",
    name: "Special Occasions",
    description: "Celebrate with these recipes",
    icon: UtensilsCrossed,
    subcategories: ["Holiday", "Birthday", "Dinner Party", "BBQ"],
    color: "bg-teal-500",
  },
]

export default function RecipeCategories() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => {
        const Icon = category.icon
        return (
          <Link key={category.id} href={`/categories/${category.id}`}>
            <Card className="h-full p-6 hover:shadow-lg transition-all border-amber-200 hover:border-amber-300 cursor-pointer group">
              <div className="flex flex-col h-full">
                <div className={`w-12 h-12 rounded-lg ${category.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-amber-800 mb-2">{category.name}</h3>
                <p className="text-amber-600 text-sm mb-4">{category.description}</p>
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {category.subcategories.map((sub) => (
                      <span
                        key={sub}
                        className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-200"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
} 