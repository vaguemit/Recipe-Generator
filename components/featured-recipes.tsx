"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"

export default function FeaturedRecipes() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef(null)

  const featuredRecipes = [
    {
      id: 1,
      name: "Creamy Garlic Parmesan Pasta",
      time: "25 mins",
      difficulty: "Easy",
      tags: ["Italian", "Vegetarian"],
      image: "/placeholder.svg?height=300&width=400&text=Creamy+Pasta",
    },
    {
      id: 2,
      name: "Spicy Thai Basil Chicken",
      time: "30 mins",
      difficulty: "Medium",
      tags: ["Thai", "Spicy"],
      image: "/placeholder.svg?height=300&width=400&text=Thai+Chicken",
    },
    {
      id: 3,
      name: "Mediterranean Quinoa Salad",
      time: "20 mins",
      difficulty: "Easy",
      tags: ["Healthy", "Vegetarian"],
      image: "/placeholder.svg?height=300&width=400&text=Quinoa+Salad",
    },
    {
      id: 4,
      name: "Classic Beef Lasagna",
      time: "90 mins",
      difficulty: "Medium",
      tags: ["Italian", "Comfort Food"],
      image: "/placeholder.svg?height=300&width=400&text=Beef+Lasagna",
    },
    {
      id: 5,
      name: "Chocolate Lava Cake",
      time: "40 mins",
      difficulty: "Medium",
      tags: ["Dessert", "Chocolate"],
      image: "/placeholder.svg?height=300&width=400&text=Chocolate+Cake",
    },
    {
      id: 6,
      name: "Grilled Salmon with Lemon",
      time: "25 mins",
      difficulty: "Easy",
      tags: ["Seafood", "Healthy"],
      image: "/placeholder.svg?height=300&width=400&text=Grilled+Salmon",
    },
  ]

  const scroll = (direction) => {
    const container = containerRef.current
    if (!container) return

    const scrollAmount = 320 // Approximate card width + gap
    const maxScroll = container.scrollWidth - container.clientWidth

    let newPosition
    if (direction === "left") {
      newPosition = Math.max(0, scrollPosition - scrollAmount)
    } else {
      newPosition = Math.min(maxScroll, scrollPosition + scrollAmount)
    }

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    })

    setScrollPosition(newPosition)
  }

  // Update scroll position when container scrolls
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      setScrollPosition(container.scrollLeft)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <p className="text-amber-700 max-w-2xl">Explore our collection of popular recipes loved by our community</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            disabled={scrollPosition <= 0}
            className="border-amber-200 hover:bg-amber-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="border-amber-200 hover:bg-amber-100"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {featuredRecipes.map((recipe) => (
          <Card
            key={recipe.id}
            className="min-w-[300px] max-w-[300px] border-amber-200 shadow-md hover:shadow-lg transition-shadow snap-start"
          >
            <div className="relative h-48 w-full">
              <Image
                src={recipe.image || "/placeholder.svg"}
                alt={recipe.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-amber-800">{recipe.name}</h3>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1 text-amber-700">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{recipe.time}</span>
                </div>
                <span className="text-sm text-amber-700">{recipe.difficulty}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-amber-50 border-amber-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
