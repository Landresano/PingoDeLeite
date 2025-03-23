import { NextResponse } from "next/server"
import { getFromLocalStorage } from "@/lib/local-storage"

export async function POST(request: Request) {
  console.log("Rota alternativa de login chamada com o método:", request.method)

  try {
    const { email, password } = await request.json()
    console.log("Tentativa de login alternativa para o email:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Fallback para localStorage
    try {
      console.log("Usando autenticação via localStorage")
      const users = getFromLocalStorage("users") || []
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (user) {
        console.log("Autenticação via localStorage bem-sucedida")
        // Remover senha antes de retornar
        const { password: _, ...safeUser } = user

        return NextResponse.json({
          success: true,
          user: safeUser,
          token: `token-${user.id}`,
          source: "localStorage",
        })
      }

      return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 })
    } catch (localError) {
      console.error("Erro durante a autenticação via localStorage:", localError)
      return NextResponse.json({ error: "Falha na autenticação" }, { status: 500 })
    }
  } catch (error) {
    console.error("Erro durante o login:", error)
    return NextResponse.json({ error: "Falha na autenticação" }, { status: 500 })
  }
}

// Adicionar um handler para OPTIONS para lidar com preflight CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
