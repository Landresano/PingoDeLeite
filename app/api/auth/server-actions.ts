"use server"

import { cookies } from "next/headers"

// Função para autenticar usuário (server action)
export async function serverLogin(email: string, password: string) {
  try {
    // Em uma aplicação real, você verificaria as credenciais no banco de dados
    // Por enquanto, vamos simular uma autenticação simples
    if (email === "teste" && password === "teste") {
      // Definir cookie de autenticação
      cookies().set("auth_token", "sample-token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 dia
        path: "/",
      })

      return {
        success: true,
        user: {
          id: "2",
          name: "Test User",
          email: "teste",
        },
      }
    }

    // Verificar credenciais (simulado)
    const isValidUser = email === "admin@example.com" && password === "password123"

    if (isValidUser) {
      // Definir cookie de autenticação
      cookies().set("auth_token", "sample-token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 dia
        path: "/",
      })

      return {
        success: true,
        user: {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
        },
      }
    }

    return {
      success: false,
      message: "Invalid email or password",
    }
  } catch (error) {
    console.error("Server login error:", error)
    return {
      success: false,
      message: "Authentication failed",
    }
  }
}

// Função para logout (server action)
export async function serverLogout() {
  try {
    // Remover cookie de autenticação
    cookies().delete("auth_token")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Server logout error:", error)
    return {
      success: false,
      message: "Logout failed",
    }
  }
}

// Função para verificar autenticação (server action)
export async function checkAuth() {
  try {
    // Verificar se o cookie de autenticação existe
    const token = cookies().get("auth_token")?.value

    return {
      authenticated: !!token,
      token,
    }
  } catch (error) {
    console.error("Check auth error:", error)
    return {
      authenticated: false,
      error: "Failed to check authentication",
    }
  }
}

