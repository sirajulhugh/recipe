"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) {
          console.error("Error getting session:", error)
        } else {
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      setUser(session?.user ?? null)
      setLoading(false)

      // Handle confirmed user signup (when they click the email link)
      if (event === "SIGNED_IN" && session?.user && !session.user.user_metadata?.profile_created) {
        await createUserProfile(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const createUserProfile = async (user: User) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase.from("profiles").select("id").eq("user_id", user.id).single()

      if (!existingProfile) {
        const { error } = await supabase.from("profiles").insert({
          user_id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        })

        if (error) {
          console.error("Error creating profile:", error)
        } else {
          console.log("Profile created successfully")

          // Update user metadata to mark profile as created
          await supabase.auth.updateUser({
            data: { profile_created: true },
          })
        }
      }
    } catch (error) {
      console.error("Exception creating profile:", error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        console.error("Sign in error:", error)

        // Provide more helpful error messages
        if (error.message.includes("Email not confirmed")) {
          return { error: "Please check your email and click the confirmation link before signing in." }
        } else if (error.message.includes("Invalid login credentials")) {
          return { error: "Invalid email or password. Please check your credentials and try again." }
        }

        return { error: error.message }
      }

      console.log("Sign in successful:", data.user?.email)
      return {}
    } catch (error: any) {
      console.error("Sign in exception:", error)
      return { error: error.message || "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      })

      if (error) {
        console.error("Sign up error:", error)
        return { error: error.message }
      }

      if (!data.user) {
        return { error: "Failed to create user account" }
      }

      console.log("Sign up successful:", data.user.email)

      // If email confirmation is required (no session returned)
      if (data.user && !data.session) {
        return {
          error: "Please check your email to confirm your account before signing in.",
        }
      }

      // If user is immediately signed in (email confirmation disabled)
      return {}
    } catch (error: any) {
      console.error("Sign up exception:", error)
      return { error: error.message || "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Sign out error:", error)
        throw error
      }
      console.log("Sign out successful")
    } catch (error) {
      console.error("Sign out exception:", error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
