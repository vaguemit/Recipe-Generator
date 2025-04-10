import { Button } from "@/components/ui/button"
import { Beef, Carrot, Fish, Salad, Coffee, Pizza, Clock, Flame, Utensils, Apple, Cake, Egg } from "lucide-react"

export default function CategorySelector() {
  const categories = [
    { name: "Quick Meals", icon: <Clock className="h-5 w-5" /> },
    { name: "Vegetarian", icon: <Carrot className="h-5 w-5" /> },
    { name: "Meat", icon: <Beef className="h-5 w-5" /> },
    { name: "Seafood", icon: <Fish className="h-5 w-5" /> },
    { name: "Salads", icon: <Salad className="h-5 w-5" /> },
    { name: "Breakfast", icon: <Egg className="h-5 w-5" /> },
    { name: "Desserts", icon: <Cake className="h-5 w-5" /> },
    { name: "Italian", icon: <Pizza className="h-5 w-5" /> },
    { name: "Healthy", icon: <Apple className="h-5 w-5" /> },
    { name: "Spicy", icon: <Flame className="h-5 w-5" /> },
    { name: "Beverages", icon: <Coffee className="h-5 w-5" /> },
    { name: "Dinner", icon: <Utensils className="h-5 w-5" /> },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Button
          key={category.name}
          variant="outline"
          className="h-auto py-6 flex flex-col gap-2 border-amber-200 hover:bg-amber-100 hover:text-amber-900 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            {category.icon}
          </div>
          <span>{category.name}</span>
        </Button>
      ))}
    </div>
  )
}
