"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Definir o tipo para o usuário
interface User {
  id: string
  name: string
  email: string
}

// Definir o tipo para o contexto de autenticação
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<boolean>
}

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook personalizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Provedor do contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar se há um token no localStorage
        const token = localStorage.getItem("auth_token")
        if (!token) {
          setLoading(false)
          return
        }

        // Verificar se o token é válido
        const userJson = localStorage.getItem("current_user")
        if (userJson) {
          setUser(JSON.parse(userJson))
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)

      // Em uma aplicação real, você faria uma chamada à API
      // Por enquanto, vamos simular uma autenticação simples
      if (email === "teste" && password === "teste") {
        const user = {
          id: "2",
          name: "Test User",
          email: "teste",
        }

        localStorage.setItem("auth_token", "sample-token")
        localStorage.setItem("current_user", JSON.stringify(user))
        setUser(user)
        return true
      }

      // Verificar credenciais (simulado)
      const isValidUser = email === "admin@example.com" && password === "password123"

      if (isValidUser) {
        const user = {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
        }

        localStorage.setItem("auth_token", "sample-token")
        localStorage.setItem("current_user", JSON.stringify(user))
        setUser(user)
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Função de logout
  const logout = async (): Promise<void> => {
    try {
      setLoading(true)

      // Remover token e usuário do localStorage
      localStorage.removeItem("auth_token")
      localStorage.removeItem("current_user")
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Função de registro
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)

      // Em uma aplicação real, você faria uma chamada à API
      // Por enquanto, vamos simular um registro bem-sucedido
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
      }

      localStorage.setItem("auth_token", "sample-token")
      localStorage.setItem("current_user", JSON.stringify(newUser))
      setUser(newUser)

      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

