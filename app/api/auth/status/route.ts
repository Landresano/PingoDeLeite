import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Aqui você verificaria o token de autenticação
  // Por enquanto, vamos simular uma resposta
  return NextResponse.json({
    authenticated: false,
    message: "No valid session found",
  })
}

