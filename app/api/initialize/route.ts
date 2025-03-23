import { NextResponse } from "next/server"
import { initializeSampleDataInDB } from "../mongodb/actions"

export async function POST(request: Request) {
  try {
    const sampleData = await request.json()
    const success = await initializeSampleDataInDB(sampleData)

    return NextResponse.json({ sucesso: success })
  } catch (error) {
    console.error("Erro ao inicializar os dados de exemplo:", error)
    return NextResponse.json({ erro: "Falha ao inicializar os dados de exemplo" }, { status: 500 })
  }
}
