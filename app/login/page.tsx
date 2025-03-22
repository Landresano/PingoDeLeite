"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { handleError, logAction } from "@/lib/error-handler"
import { initializeDefaultUsers, loginUser } from "@/lib/client-auth-service"
import { initializeSampleData } from "@/lib/db-service"
import { useDatabaseHealth } from "@/components/database-health-check"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { isConnected } = useDatabaseHealth()
  const router = useRouter()
  const { toast } = useToast()

  // Initialize sample data and default users on component mount
  useEffect(() => {
    const initialize = async () => {
      try {
        // Inicializar dados de amostra
        initializeSampleData()

        // Inicializar usuários padrão
        initializeDefaultUsers()
      } catch (error) {
        console.error("Error initializing data:", error)
      }
    }

    initialize()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      console.log("Login attempt with:", { email, password })

      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Tente o método original
      const success = await loginUser(email, password)

      if (success) {
        console.log("Login successful, setting auth token")

        // Log the action
        try {
          await logAction("Login", toast, true, { username: email })
        } catch (logError) {
          console.error("Error logging action:", logError)
          // Continue even if logging fails
        }

        console.log("Redirecting to dashboard")
        // Usar replace em vez de push para evitar problemas com o histórico
        router.replace("/dashboard")
        return
      } else {
        throw new Error("Invalid email or password")
      }
    } catch (error) {
      const errorMsg = handleError(error, toast, "Login failed")
      setErrorMessage(errorMsg)
      try {
        await logAction("Login", toast, false, { username: email, error: errorMsg })
      } catch (logError) {
        console.error("Error logging action:", logError)
      }
    }
     // Tentar a rota alternativa primeiro
     try {
      console.log("Trying alternative login route")
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      })

      console.log("Alternative login response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Alternative login response data:", data)

        if (data.success) {
          // Store auth token in localStorage
          localStorage.setItem("auth_token", data.token || "sample-token")
          localStorage.setItem("current_user", JSON.stringify(data.user))

          // Log the action
          try {
            await logAction("Login", toast, true, { username: email })
          } catch (logError) {
            console.error("Error logging action:", logError)
          }

          console.log("Redirecting to dashboard")
          // Usar replace em vez de push para evitar problemas com o histórico
          router.replace("/dashboard")
          return
        }
      } else {
        console.error("Alternative login failed with status:", response.status)
      }
    } catch (altError) {
      console.error("Alternative login error:", altError)
    }
    finally {
      setIsLoading(false)
    }
  }

  // Determine if we should use email type input
  const isTestUser = email === "teste"
  const inputType = isTestUser ? "text" : "text" // Changed to text for all users to avoid validation issues

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Pingo de Leite</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar</CardDescription>
          <div className="flex items-center justify-center mt-2">
            <span
              className={`inline-block h-2 w-2 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}
            ></span>
            <span className="text-xs text-muted-foreground">
              {isConnected ? "MongoDB Online" : "MongoDB Offline (Usando localStorage)"}
            </span>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Username / Email</Label>
              <Input
                id="email"
                type={inputType}
                placeholder="username or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Test credentials: Username: <span className="font-medium">teste</span> / Password:{" "}
              <span className="font-medium">teste</span>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

