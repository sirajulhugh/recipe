"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface Recipe {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory: string
}

interface Favorite {
  id: string
  recipe_id: string
  recipe_name: string
  recipe_image: string
  recipe_category: string
  created_at: string
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (user) {
      fetchFavorites()
    } else {
      setFavorites([])
    }
  }, [user])

  const fetchFavorites = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Fetch favorites error:", error)
        throw error
      }
      setFavorites(data || [])
    } catch (error: any) {
      console.error("Exception fetching favorites:", error)
      toast({
        title: "Error",
        description: "Failed to fetch favorites",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = async (recipe: Recipe) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add favorites",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        recipe_id: recipe.idMeal,
        recipe_name: recipe.strMeal,
        recipe_image: recipe.strMealThumb,
        recipe_category: recipe.strCategory,
      })

      if (error) {
        console.error("Add favorite error:", error)
        if (error.code === "23505") {
          toast({
            title: "Already in favorites",
            description: "This recipe is already in your favorites.",
            variant: "destructive",
          })
        } else {
          throw error
        }
      } else {
        toast({
          title: "Added to favorites!",
          description: `${recipe.strMeal} has been added to your favorites.`,
        })
        fetchFavorites()
      }
    } catch (error: any) {
      console.error("Exception adding favorite:", error)
      toast({
        title: "Error",
        description: "Failed to add to favorites",
        variant: "destructive",
      })
    }
  }

  const removeFromFavorites = async (recipeId: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("recipe_id", recipeId)

      if (error) {
        console.error("Remove favorite error:", error)
        throw error
      }

      toast({
        title: "Removed from favorites",
        description: "Recipe has been removed from your favorites.",
      })

      fetchFavorites()
    } catch (error: any) {
      console.error("Exception removing favorite:", error)
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      })
    }
  }

  const isFavorite = (recipeId: string) => {
    return favorites.some((fav) => fav.recipe_id === recipeId)
  }

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    fetchFavorites,
  }
}
