import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { logRequest } from "../middleware"

export async function GET(request: Request) {
  try {
    // Usar as funções de middleware com await
    const req = request as unknown as NextRequest

    // Log da requisição
    await logRequest(req)

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("Error checking auth status:", error)
    return NextResponse.json({ error: "Failed to check auth status" }, { status: 500 })
  }
}

