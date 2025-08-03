"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ChefHat, Users, Star, TrendingUp, Heart } from "lucide-react"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "./auth-modal"
import { AuthTest } from "./auth-test"

interface Recipe {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory: string
  strArea: string
}

interface LandingPageProps {
  onExploreRecipes: () => void
}

export function LandingPage({ onExploreRecipes }: LandingPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([])
  const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user } = useAuth()

  const categories = [
    { name: "Breakfast", emoji: "🥞", color: "bg-yellow-100 text-yellow-800" },
    { name: "Chicken", emoji: "🍗", color: "bg-orange-100 text-orange-800" },
    { name: "Dessert", emoji: "🍰", color: "bg-pink-100 text-pink-800" },
    { name: "Pasta", emoji: "🍝", color: "bg-red-100 text-red-800" },
    { name: "Seafood", emoji: "🦐", color: "bg-blue-100 text-blue-800" },
    { name: "Vegetarian", emoji: "🥗", color: "bg-green-100 text-green-800" },
  ]

  useEffect(() => {
    fetchFeaturedRecipes()
    fetchTrendingRecipes()
  }, [])

  const fetchFeaturedRecipes = async () => {
    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=chicken")
      const data = await response.json()
      setFeaturedRecipes(data.meals?.slice(0, 3) || [])
    } catch (error) {
      console.error("Failed to fetch featured recipes:", error)
    }
  }

  const fetchTrendingRecipes = async () => {
    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=pasta")
      const data = await response.json()
      setTrendingRecipes(data.meals?.slice(0, 4) || [])
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch trending recipes:", error)
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onExploreRecipes()
    }
  }

  const handleCategoryClick = (category: string) => {
    onExploreRecipes()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ChefHat className="w-8 h-8 text-orange-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Recipe Finder
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Welcome back, {user.user_metadata?.full_name || user.email}!
                  </span>
                  <Button onClick={onExploreRecipes}>Browse Recipes</Button>
                </div>
              ) : (
                <Button onClick={() => setShowAuthModal(true)}>Sign In</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Your Next
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent block">
              Favorite Recipe
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore thousands of delicious recipes from around the world. Find the perfect dish for any occasion, save
            your favorites, and start cooking!
          </p>

          {/* Hero Search */}
          <div className="flex gap-4 max-w-lg mx-auto mb-8">
            <Input
              type="text"
              placeholder="Search for any recipe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 h-12 text-lg"
            />
            <Button onClick={handleSearch} size="lg" className="h-12 px-8">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>

          <Button onClick={onExploreRecipes} variant="outline" size="lg" className="mb-12 bg-transparent">
            Or Browse All Recipes →
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ChefHat className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={1000} suffix="+" />
              </h3>
              <p className="text-gray-600 font-medium">Delicious Recipes</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={50} suffix="K+" />
              </h3>
              <p className="text-gray-600 font-medium">Happy Cooks</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">4.9★</h3>
              <p className="text-gray-600 font-medium">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Popular Categories</h3>
            <p className="text-gray-600">Explore recipes by your favorite cuisine types</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-lg"
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{category.emoji}</div>
                  <Badge className={category.color} variant="secondary">
                    {category.name}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Recipes</h3>
            <p className="text-gray-600">Hand-picked recipes that our community loves</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredRecipes.map((recipe) => (
                <Card
                  key={recipe.idMeal}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={recipe.strMealThumb || "/placeholder.svg"}
                      alt={recipe.strMeal}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-orange-500 text-white">Featured</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-orange-600 transition-colors">
                      {recipe.strMeal}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{recipe.strCategory}</Badge>
                      <Badge variant="outline">{recipe.strArea}</Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Recipes */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-red-500" />
              <h3 className="text-3xl font-bold text-gray-900">Trending Now</h3>
            </div>
            <p className="text-gray-600">The most popular recipes this week</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-32 bg-gray-200 animate-pulse"></div>
                  <CardHeader className="p-4">
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingRecipes.map((recipe, index) => (
                <Card
                  key={recipe.idMeal}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="relative">
                    <img
                      src={recipe.strMealThumb || "/placeholder.svg"}
                      alt={recipe.strMeal}
                      className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white">#{index + 1}</Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm group-hover:text-red-600 transition-colors line-clamp-2">
                      {recipe.strMeal}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-white mb-6">Ready to Start Cooking?</h3>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of home cooks discovering amazing recipes every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={onExploreRecipes} className="text-lg px-8 py-3">
              <Search className="w-5 h-5 mr-2" />
              Explore Recipes
            </Button>
            {!user && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowAuthModal(true)}
                className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-orange-600"
              >
                <Heart className="w-5 h-5 mr-2" />
                Save Favorites
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Auth Test Section - Remove this in production */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AuthTest />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="w-6 h-6 text-orange-500" />
                <h4 className="text-xl font-bold">Recipe Finder</h4>
              </div>
              <p className="text-gray-400">Discover, cook, and share amazing recipes from around the world.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-gray-400">
                <li>• Search thousands of recipes</li>
                <li>• Save your favorites</li>
                <li>• Step-by-step instructions</li>
                <li>• Video tutorials</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Categories</h5>
              <ul className="space-y-2 text-gray-400">
                <li>• Breakfast & Brunch</li>
                <li>• Main Dishes</li>
                <li>• Desserts</li>
                <li>• International Cuisine</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Recipe Finder. Made with ❤️ for food lovers.</p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
