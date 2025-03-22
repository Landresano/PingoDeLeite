"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/local-storage"

export function AuthForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Signup form state
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")

  // Reset password form state
  const [resetEmail, setResetEmail] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      const users = getFromLocalStorage("users") || []
      const user = users.find((u: any) => u.email === loginEmail && u.password === loginPassword)

      if (user) {
        // Save auth token and user info
        localStorage.setItem("auth_token", "sample_token")
        localStorage.setItem("current_user", JSON.stringify(user))

        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        })

        router.push("/dashboard")
      } else {
        toast({
          title: "Erro de login",
          description: "Email ou senha incorretos",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro de login",
        description: "Ocorreu um erro ao fazer login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      const users = getFromLocalStorage("users") || []

      // Check if email already exists
      if (users.some((u: any) => u.email === signupEmail)) {
        toast({
          title: "Erro de cadastro",
          description: "Este email já está em uso",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        createdAt: new Date().toISOString(),
      }

      // Save user to local storage
      saveToLocalStorage("users", [...users, newUser])

      toast({
        title: "Cadastro bem-sucedido",
        description: "Sua conta foi criada com sucesso",
      })

      // Auto login after signup
      localStorage.setItem("auth_token", "sample_token")
      localStorage.setItem("current_user", JSON.stringify(newUser))

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Erro de cadastro",
        description: "Ocorreu um erro ao criar sua conta",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would send an email
      const users = getFromLocalStorage("users") || []
      const userExists = users.some((u: any) => u.email === resetEmail)

      if (userExists) {
        toast({
          title: "Email enviado",
          description: "Verifique seu email para redefinir sua senha",
        })
      } else {
        toast({
          title: "Email não encontrado",
          description: "Não encontramos uma conta com este email",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Cadastro</TabsTrigger>
        <TabsTrigger value="reset">Esqueci a senha</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="signup">
        <form onSubmit={handleSignup} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="seu@email.com"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Senha</Label>
            <Input
              id="signup-password"
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="reset">
        <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="seu@email.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar link de redefinição"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}

