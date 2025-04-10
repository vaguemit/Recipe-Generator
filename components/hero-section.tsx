"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export default function HeroSection() {
  const scrollToGenerator = () => {
    const generatorElement = document.querySelector("#recipe-generator")
    if (generatorElement) {
      generatorElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700">
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
          Transform Your Ingredients Into Delicious Meals
        </h1>
        <p className="text-xl md:text-2xl text-amber-50 mb-8 max-w-2xl mx-auto">
          Our AI-powered recipe generator creates personalized recipes based on what you have in your kitchen
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-lg"
            onClick={scrollToGenerator}
          >
            Create Recipe Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
          >
            Browse Categories
          </Button>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/20 hover:bg-white/30 text-white"
          onClick={scrollToGenerator}
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
