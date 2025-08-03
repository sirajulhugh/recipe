"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Heart, HeartOff, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/hooks/use-favorites"
import { AuthModal } from "./auth-modal"
import { useToast } from "@/hooks/use-toast"

interface Recipe {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory: string
  strArea: string
  strInstructions: string
  strYoutube: string
}

interface RecipeFinderProps {
  onViewProfile: () => void
  onBackToLanding?: () => void
}

export function RecipeFinder({ onViewProfile, onBackToLanding }: RecipeFinderProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const { user, signOut } = useAuth()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { toast } = useToast()

  const searchRecipes = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`,
      )
      const data = await response.json()
      setRecipes(data.meals || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search recipes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteClick = (recipe: Recipe) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (isFavorite(recipe.idMeal)) {
      removeFromFavorites(recipe.idMeal)
    } else {
      addToFavorites(recipe)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">Recipe Finder</h1>
              {onBackToLanding && (
                <Button variant="ghost" onClick={onBackToLanding} className="text-gray-600">
                  ← Back to Home
                </Button>
              )}
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Button variant="outline" onClick={onViewProfile}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                  <span className="text-sm text-gray-600">Welcome, {user.user_metadata?.full_name || user.email}!</span>
                </>
              ) : (
                <Button onClick={() => setShowAuthModal(true)}>Sign In</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="flex gap-4 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search for recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchRecipes()}
              className="flex-1"
            />
            <Button onClick={searchRecipes} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe.idMeal} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={recipe.strMealThumb || "/placeholder.svg"}
                  alt={recipe.strMeal}
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => handleFavoriteClick(recipe)}
                >
                  {isFavorite(recipe.idMeal) ? (
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  ) : (
                    <HeartOff className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{recipe.strMeal}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{recipe.strCategory}</Badge>
                  <Badge variant="outline">{recipe.strArea}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setSelectedRecipe(recipe)}>
                  View Recipe
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {recipes.length === 0 && searchTerm && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No recipes found. Try a different search term.</p>
          </div>
        )}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{selectedRecipe.strMeal}</CardTitle>
                  <CardDescription className="flex gap-2 mt-2">
                    <Badge variant="secondary">{selectedRecipe.strCategory}</Badge>
                    <Badge variant="outline">{selectedRecipe.strArea}</Badge>
                  </CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setSelectedRecipe(null)} className="text-gray-500">
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <img
                src={selectedRecipe.strMealThumb || "/placeholder.svg"}
                alt={selectedRecipe.strMeal}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Instructions:</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{selectedRecipe.strInstructions}</p>
                </div>
                {selectedRecipe.strYoutube && (
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedRecipe.strYoutube, "_blank")}
                      className="w-full"
                    >
                      Watch Video Tutorial
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
