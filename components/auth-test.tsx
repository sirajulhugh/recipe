"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase"

export function AuthTest() {
  const [testResult, setTestResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user, signIn, signUp, signOut } = useAuth()
  const supabase = getSupabaseClient()

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        setTestResult(`❌ Connection Error: ${error.message}`)
      } else {
        setTestResult(`✅ Connection Success! Session: ${data.session ? "Active" : "None"}`)
      }
    } catch (error: any) {
      setTestResult(`❌ Connection Failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testDatabase = async () => {
    setIsLoading(true)
    try {
      // Test if we can query the profiles table
      const { data, error } = await supabase.from("profiles").select("count").limit(1)

      if (error) {
        setTestResult(`❌ Database Error: ${error.message}`)
      } else {
        setTestResult(`✅ Database Connection Success!`)
      }
    } catch (error: any) {
      setTestResult(`❌ Database Failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testSignUp = async () => {
    setIsLoading(true)
    const testEmail = `test${Date.now()}@example.com`
    const testPassword = "testpassword123"
    const testName = "Test User"

    const result = await signUp(testEmail, testPassword, testName)
    if (result.error) {
      setTestResult(`❌ Sign Up Failed: ${result.error}`)
    } else {
      setTestResult(`✅ Sign Up Success! Email: ${testEmail}`)
    }
    setIsLoading(false)
  }

  const testSignIn = async () => {
    setIsLoading(true)
    // Try with a simple test account
    const result = await signIn("test@example.com", "password123")
    if (result.error) {
      setTestResult(`❌ Sign In Failed: ${result.error}`)
    } else {
      setTestResult("✅ Sign In Success!")
    }
    setIsLoading(false)
  }

  const testSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
      setTestResult("✅ Sign Out Success!")
    } catch (error: any) {
      setTestResult(`❌ Sign Out Failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>🧪 Authentication Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm p-3 bg-blue-50 rounded">
          <strong>Current User:</strong> {user ? `${user.email} (ID: ${user.id.slice(0, 8)}...)` : "Not signed in"}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <Button onClick={testConnection} size="sm" variant="outline" disabled={isLoading}>
            Test Connection
          </Button>
          <Button onClick={testDatabase} size="sm" variant="outline" disabled={isLoading}>
            Test Database
          </Button>
          <Button onClick={testSignUp} size="sm" variant="outline" disabled={isLoading}>
            Test Sign Up
          </Button>
          <Button onClick={testSignIn} size="sm" variant="outline" disabled={isLoading}>
            Test Sign In
          </Button>
          <Button onClick={testSignOut} size="sm" variant="outline" disabled={isLoading || !user}>
            Test Sign Out
          </Button>
        </div>

        {testResult && <div className="p-3 bg-gray-100 rounded text-sm font-mono">{testResult}</div>}

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Environment Check:</strong>
          </p>
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}</p>
          <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}</p>
        </div>

        <div className="text-xs text-gray-600 p-3 bg-yellow-50 rounded">
          <p>
            <strong>💡 Troubleshooting Tips:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Make sure Supabase integration is added to your project</li>
            <li>Run the database setup script first</li>
            <li>Check that RLS policies are properly configured</li>
            <li>Verify email confirmation settings in Supabase dashboard</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
