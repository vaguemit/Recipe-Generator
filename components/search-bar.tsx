"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if window is available (client-side)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkMobile()
    
    // Add resize listener
    window.addEventListener("resize", checkMobile)
    
    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const toggleSearch = () => {
    setIsExpanded(!isExpanded)
    if (isExpanded) {
      setSearchQuery("")
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex items-center">
        {(isExpanded || !isMobile) ? (
          <>
            <Input
              type="search"
              placeholder="Search recipes, ingredients..."
              className="w-full md:w-[300px] border-amber-200 focus:border-amber-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-1 text-amber-600 hover:text-amber-800 hover:bg-transparent"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="md:hidden ml-1" onClick={toggleSearch}>
              <X className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <Button type="button" size="icon" variant="ghost" className="text-amber-800" onClick={toggleSearch}>
            <Search className="h-5 w-5" />
          </Button>
        )}
      </form>
    </div>
  )
}
