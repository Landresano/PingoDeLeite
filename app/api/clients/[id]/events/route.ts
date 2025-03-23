import { NextResponse } from "next/server"
import { fetchEventsByClientFromDB } from "../../../mongodb/actions"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const events = await fetchEventsByClientFromDB(params.id)
    return NextResponse.json(events)
  } catch (error) {
    console.error(`Erro ao buscar eventos para o cliente ${params.id}:`, error)
    return NextResponse.json({ error: "Falha ao buscar eventos para o cliente" }, { status: 500 })
  }
}
