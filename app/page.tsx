import RecipeGenerator from "@/components/recipe-generator"
import HeroSection from "@/components/hero-section"
import CategorySelector from "@/components/category-selector"
import SearchBar from "@/components/search-bar"
import { Toaster } from "@/components/ui/toaster"
import StepByStepGuide from "@/components/step-by-step-guide"
import RecipeCategories from "@/components/recipe-categories"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 max-w-6xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-amber-600 text-white p-1 rounded-md font-bold">RW</span>
            <span className="font-bold text-amber-800">Recipe Wizard</span>
          </Link>
          <SearchBar />
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-amber-800 hover:text-amber-600 font-medium">
              Home
            </Link>
            <Link href="/meal-planner" className="text-amber-800 hover:text-amber-600 font-medium">
              Meal Planner
            </Link>
            <Link href="/shopping-list" className="text-amber-800 hover:text-amber-600 font-medium">
              Shopping List
            </Link>
            <Link href="/saved-recipes" className="text-amber-800 hover:text-amber-600 font-medium">
              Saved Recipes
            </Link>
          </nav>
        </div>
      </header>

      <HeroSection />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-amber-800">Find Your Perfect Recipe</h2>
            <Link
              href="/advanced-search"
              className="text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1"
            >
              Advanced Search
            </Link>
          </div>
          <CategorySelector />
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-amber-800">Step-by-Step Recipe Creation</h2>
            <Link href="/recipe-generator" className="text-amber-600 hover:text-amber-800 font-medium">
              Quick Generator
            </Link>
          </div>
          <StepByStepGuide />
        </section>

        <section className="mb-16">
          <RecipeGenerator />
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-amber-800">Explore Recipe Categories</h2>
            <Link href="/categories" className="text-amber-600 hover:text-amber-800 font-medium">
              View All Categories
            </Link>
          </div>
          <RecipeCategories />
        </section>
      </main>

      <footer className="bg-amber-800 text-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Recipe Wizard</h3>
              <p className="text-amber-100">
                Your AI-powered kitchen assistant that helps you create delicious meals with ingredients you have on
                hand.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-amber-100 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/meal-planner" className="text-amber-100 hover:text-white transition-colors">
                    Meal Planner
                  </Link>
                </li>
                <li>
                  <Link href="/shopping-list" className="text-amber-100 hover:text-white transition-colors">
                    Shopping List
                  </Link>
                </li>
                <li>
                  <Link href="/saved-recipes" className="text-amber-100 hover:text-white transition-colors">
                    Saved Recipes
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-amber-100 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-amber-100 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-amber-100 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-amber-700 text-center text-amber-100">
            <p>© 2025 Recipe Wizard. All rights reserved.</p>
            <p className="mt-2 text-amber-200">Made by Dirgh, Devarsh, Gyan, Mustafa</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  )
}
