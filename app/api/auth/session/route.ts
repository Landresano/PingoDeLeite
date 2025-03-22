import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { logRequest, withAuth } from "../middleware"

export async function GET(request: Request) {
  const req = request as unknown as NextRequest

  // Log da requisição
  await logRequest(req)

  // Usar o middleware de autenticação
  const handler = async (req: NextRequest) => {
    // In a real app, this would validate the token and return the user session
    return NextResponse.json({
      user: {
        id: "1",
        name: "Mock User",
        email: "mock@example.com",
      },
    })
  }

  return await withAuth(handler)(req)
}

