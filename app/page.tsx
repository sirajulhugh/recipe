"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { RecipeFinder } from "@/components/recipe-finder"
import { ProfilePage } from "@/components/profile-page"
import { LandingPage } from "@/components/landing-page"
import { Toaster } from "@/components/ui/toaster"

function AppContent() {
  const [currentView, setCurrentView] = useState<"landing" | "recipes" | "profile">("landing")
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Recipe Finder...</p>
        </div>
      </div>
    )
  }

  // Show landing page for new visitors or when explicitly navigated to
  if (currentView === "landing") {
    return <LandingPage onExploreRecipes={() => setCurrentView("recipes")} />
  }

  // Show recipes page
  if (currentView === "recipes") {
    return (
      <RecipeFinder onViewProfile={() => setCurrentView("profile")} onBackToLanding={() => setCurrentView("landing")} />
    )
  }

  // Show profile page
  return <ProfilePage onBack={() => setCurrentView("recipes")} />
}

export default function Home() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <AppContent />
      </div>
      <Toaster />
    </AuthProvider>
  )
}
