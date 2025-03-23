import { NextResponse } from "next/server"
import { fetchEventsFromDB, createEventInDB } from "../mongodb/actions"

export async function GET() {
  try {
    const eventos = await fetchEventsFromDB()
    return NextResponse.json(eventos)
  } catch (error) {
    console.error("Erro ao buscar eventos:", error)
    return NextResponse.json({ error: "Falha ao buscar eventos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const dadosEvento = await request.json()
    const novoEvento = await createEventInDB(dadosEvento)

    if (!novoEvento) {
      return NextResponse.json({ error: "Falha ao criar evento" }, { status: 500 })
    }

    return NextResponse.json(novoEvento, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar evento:", error)
    return NextResponse.json({ error: "Falha ao criar evento" }, { status: 500 })
  }
}
