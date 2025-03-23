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

  // Inicializar dados de amostra e usuários padrão ao montar o componente
  useEffect(() => {
    const initialize = async () => {
      try {
        initializeSampleData()
        initializeDefaultUsers()
      } catch (error) {
        console.error("Erro ao inicializar os dados:", error)
      }
    }

    initialize()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      console.log("Tentativa de login com:", { email, password })

      if (!email || !password) {
        throw new Error("Email e senha são obrigatórios")
      }

      const success = await loginUser(email, password)

      if (success) {
        console.log("Login bem-sucedido, configurando token de autenticação")

        try {
          await logAction("Login", toast, true, { username: email })
        } catch (logError) {
          console.error("Erro ao registrar ação:", logError)
        }

        console.log("Redirecionando para o painel")
        router.replace("/dashboard")
        return
      } else {
        throw new Error("Email ou senha inválidos")
      }
    } catch (error) {
      const errorMsg = handleError(error, toast, "Falha no login")
      setErrorMessage(errorMsg)
      try {
        await logAction("Login", toast, false, { username: email, error: errorMsg })
      } catch (logError) {
        console.error("Erro ao registrar ação:", logError)
      }
    }

    try {
      console.log("Tentando rota alternativa de login")
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      })

      console.log("Status da resposta de login alternativa:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Dados da resposta de login alternativa:", data)

        if (data.success) {
          localStorage.setItem("auth_token", data.token || "sample-token")
          localStorage.setItem("current_user", JSON.stringify(data.user))

          try {
            await logAction("Login", toast, true, { username: email })
          } catch (logError) {
            console.error("Erro ao registrar ação:", logError)
          }

          console.log("Redirecionando para o painel")
          router.replace("/dashboard")
          return
        }
      } else {
        console.error("Falha no login alternativo com status:", response.status)
      }
    } catch (altError) {
      console.error("Erro no login alternativo:", altError)
    } finally {
      setIsLoading(false)
    }
  }

  const isTestUser = email === "teste"
  const inputType = isTestUser ? "text" : "text"

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
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Usuário / Email</Label>
              <Input
                id="email"
                type={inputType}
                placeholder="usuário ou email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
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
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Credenciais de teste: Usuário: <span className="font-medium">teste</span> / Senha:{" "}
              <span className="font-medium">teste</span>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
