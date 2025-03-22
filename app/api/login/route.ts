import { NextResponse } from "next/server"
import { getFromLocalStorage } from "@/lib/local-storage"

export async function POST(request: Request) {
  console.log("Alternative login route called with method:", request.method)

  try {
    const { email, password } = await request.json()
    console.log("Alternative login attempt for email:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Fallback para localStorage
    try {
      console.log("Using localStorage authentication")
      const users = getFromLocalStorage("users") || []
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (user) {
        console.log("localStorage authentication successful")
        // Remover senha antes de retornar
        const { password: _, ...safeUser } = user

        return NextResponse.json({
          success: true,
          user: safeUser,
          token: `token-${user.id}`,
          source: "localStorage",
        })
      }

      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    } catch (localError) {
      console.error("Error during localStorage authentication:", localError)
      return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error during login:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
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

