"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Loader2, Mail } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()

  if (!isOpen) return null

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setFullName("")
    setError("")
    setShowPassword(false)
    setShowEmailConfirmation(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required")
      return false
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return false
    }

    if (!password) {
      setError("Password is required")
      return false
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }

    if (!isLogin && !fullName.trim()) {
      setError("Full name is required")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        const result = await signIn(email, password)
        if (result.error) {
          setError(result.error)
        } else {
          toast({
            title: "Welcome back!",
            description: "You've been signed in successfully.",
          })
          handleClose()
        }
      } else {
        const result = await signUp(email, password, fullName)
        if (result.error) {
          // Check if it's an email confirmation message
          if (result.error.includes("check your email") || result.error.includes("confirm")) {
            setShowEmailConfirmation(true)
            setError("")
          } else {
            setError(result.error)
          }
        } else {
          // Account created successfully
          toast({
            title: "Account created successfully!",
            description: "Welcome to Recipe Finder! You can now save your favorite recipes.",
          })
          handleClose()
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error)
      setError(error.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setShowEmailConfirmation(false)
  }

  // Show email confirmation screen
  if (showEmailConfirmation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>We've sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">We've sent a confirmation email to:</p>
              <p className="font-semibold text-gray-900">{email}</p>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Next steps:</strong>
                </p>
                <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the confirmation link in the email</li>
                  <li>Return here and sign in with your credentials</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowEmailConfirmation(false)
                  setIsLogin(true)
                }}
                className="flex-1"
              >
                Go to Sign In
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Didn't receive the email? Check your spam folder or try signing up again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
          <CardDescription className="text-center">
            {isLogin ? "Sign in to save your favorite recipes" : "Join Recipe Finder to start saving recipes"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  disabled={loading}
                  required={!isLogin}
                />
              </div>
            )}

            {!isLogin && (
              <div className="text-xs text-amber-700 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Email Confirmation Required</p>
                    <p className="mt-1">
                      Your account will be created when email confirmation is done. Please check your email and sign in
                      once confirmed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {!isLogin && <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Button variant="link" onClick={switchMode} className="text-sm" disabled={loading}>
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
            </Button>
          </div>

          {/* Help text for existing users */}
          {isLogin && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                <strong>New user?</strong> Make sure you've confirmed your email address before signing in.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
