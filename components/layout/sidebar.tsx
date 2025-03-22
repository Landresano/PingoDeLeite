"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Calendar, Home, LogOut, Users, CalendarDays } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Get current user from local storage
    const userStr = localStorage.getItem("current_user")
    if (userStr) {
      setCurrentUser(JSON.parse(userStr))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("current_user")
    router.push("/")
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      url: "/dashboard",
      isActive: pathname === "/dashboard",
    },
    {
      title: "Clientes",
      icon: Users,
      url: "/clientes",
      isActive: pathname.startsWith("/clientes"),
    },
    {
      title: "Eventos",
      icon: CalendarDays,
      url: "/eventos",
      isActive: pathname.startsWith("/eventos"),
    },
    {
      title: "Calendário",
      icon: Calendar,
      url: "/calendario",
      isActive: pathname === "/calendario",
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-4 py-2">
              <h2 className="text-xl font-bold">Pingo de Leite</h2>
              <SidebarTrigger className="ml-auto md:hidden" />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
                    <a href={item.url} className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Sair">
                  <LogOut className="mr-2 h-5 w-5" />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {currentUser && (
                <div className="px-4 py-2 text-sm text-muted-foreground">Logado como: {currentUser.name}</div>
              )}
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-4 md:p-6">
          <div className="md:hidden flex items-center mb-4">
            <SidebarTrigger />
            <h1 className="text-xl font-bold ml-2">Event CRM</h1>
          </div>
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}

