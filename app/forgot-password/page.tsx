"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { sendPasswordResetEmail } from "@/lib/client-auth-service"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await sendPasswordResetEmail(email)
      setIsSubmitted(true)
      toast({
        title: "E-mail de redefinição enviado",
        description: "Se existir uma conta com este e-mail, você receberá um link para redefinir sua senha.",
      })
    } catch (error) {
      toast({
        title: "Erro",
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
          <CardTitle className="text-2xl font-bold">Redefina sua senha</CardTitle>
          <CardDescription>Insira seu e-mail para receber um link de redefinição</CardDescription>
        </CardHeader>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar link de redefinição"}
              </Button>
              <div className="text-center text-sm">
                Lembrou sua senha?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Voltar para o login
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="mb-2">Link de redefinição enviado!</p>
              <p className="text-sm text-muted-foreground">Verifique seu e-mail para instruções sobre como redefinir sua senha.</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/login">Voltar para o login</Link>
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
