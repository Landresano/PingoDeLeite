"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { handleError } from "@/lib/error-handler"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return

    // Check if user is logged in
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("auth_token")
        console.log("Auth token:", token)

        if (!token) {
          console.log("No auth token found, redirecting to login")
          const errorMsg = "You must be logged in to access this page"
          setError(errorMsg)
          toast({
            title: "Authentication Required",
            description: errorMsg,
            variant: "destructive",
          })

          // Delay redirect to show the error message
          setTimeout(() => {
            router.push("/login")
          }, 1500)
        } else {
          console.log("User is authenticated")
          setIsAuthenticated(true)
        }
      } catch (error) {
        const errorMsg = handleError(error, toast, "Authentication error")
        setError(errorMsg)

        // Delay redirect to show the error message
        setTimeout(() => {
          router.push("/login")
        }, 1500)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, toast])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro de Autenticação</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <p className="text-center mt-4">Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  // User is authenticated, render the layout with children
  return <MainLayout>{children}</MainLayout>
}

