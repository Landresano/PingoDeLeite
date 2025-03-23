"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu, LayoutDashboard, Users, Calendar, PartyPopper, LogOut, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { handleError} from "@/lib/error-handler"
import { logAction } from "@/lib/log-handler"
import DatabaseHealthCheck from "@/components/database-health-check"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return

    try {
      setIsInitializing(true)

      // Get current user from local storage
      const userStr = localStorage.getItem("current_user")
      if (userStr) {
        setCurrentUser(JSON.parse(userStr))
      } else {
        setError("User session not found. Please log in again.")
        setTimeout(() => {
          router.replace("/login")
        }, 1500)
        return
      }
    } catch (error) {
      const errorMsg = handleError(error, toast, "Error loading user data")
      setError(errorMsg)
    } finally {
      setIsInitializing(false)
    }
  }, [router, toast])

  const handleLogout = () => {
    if (typeof window === "undefined") return

    try {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("current_user")

      logAction("Logout", toast, true)

      router.replace("/login")
    } catch (error) {
      handleError(error, toast, "Failed to log out")
    }
  }

  const handleNavigation = (href: string) => {
    try {
      router.push(href)
      setIsOpen(false)
      logAction("Navigation", toast, true, { destination: href })
    } catch (error) {
      handleError(error, toast, "Navigation failed")
    }
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Clientes",
      href: "/clientes",
      icon: Users,
    },
    {
      title: "Eventos",
      href: "/eventos",
      icon: PartyPopper,
    },
    {
      title: "Calendário",
      href: "/calendario",
      icon: Calendar,
    },
  ]

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Session Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <p className="text-center mt-4">Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  // Show loading state
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Inicializando aplicação...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center px-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]" aria-describedby="sidebar-description">
              <div className="flex h-full flex-col justify-between py-4">
                <div className="space-y-4">
                  <div className="px-3">
                    <h2 className="mb-2 text-lg font-semibold">Pingo de Leite</h2>
                    <p id="sidebar-description" className="sr-only">
                      Navigation menu for Pingo de Leite
                    </p>
                    <div className="space-y-1">
                      {navItems.map((item) => (
                        <Button
                          key={item.href}
                          variant={pathname === item.href ? "secondary" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => handleNavigation(item.href)}
                        >
                          <item.icon className="mr-2 h-5 w-5" />
                          {item.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="px-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Log out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {navItems.find((item) => item.href === pathname)?.title || "Pingo de Leite"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="text-sm mr-2">
                <span className="font-medium">{currentUser.name}</span>
              </div>
            )}
            <DatabaseHealthCheck />
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}

