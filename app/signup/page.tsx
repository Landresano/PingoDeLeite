"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { registerUser } from "@/lib/client-auth-service"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string }>({})
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; confirm?: string } = {}

    // Validar email
    if (email && email !== "teste") {
      // Exceção para o usuário de teste
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        newErrors.email = "Por favor, insira um endereço de e-mail válido"
      }
    }

    // Validar senha
    if (password) {
      if (password.length < 6) {
        newErrors.password = "A senha deve ter pelo menos 6 caracteres"
      }
    }

    // Validar confirmação de senha
    if (password !== confirmPassword) {
      newErrors.confirm = "As senhas não coincidem"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validar formulário
      const isValid = validateForm()
      if (!isValid) {
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        toast({
          title: "As senhas não coincidem",
          description: "Por favor, certifique-se de que as senhas são iguais.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const success = await registerUser(name, email, password)

      if (success) {
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Agora você pode fazer login com suas credenciais.",
        })
        router.push("/login")
      } else {
        toast({
          title: "Falha no cadastro",
          description: "Este e-mail pode já estar em uso.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Falha no cadastro",
        description: "Ocorreu um erro. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Criar uma conta</CardTitle>
          <CardDescription>Insira suas informações para criar uma conta</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="João Silva" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {errors.confirm && <p className="text-sm text-red-500">{errors.confirm}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
            <div className="text-center text-sm">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Entrar
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
