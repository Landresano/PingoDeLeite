import { NextResponse } from "next/server"
import { fetchEventsFromDB, fetchEventFromDB, updateEventInDB, deleteEventFromDB } from "../../mongodb/actions"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const evento = await fetchEventFromDB(params.id)

    if (!evento) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 })
    }

    return NextResponse.json(evento)
  } catch (error) {
    console.error(`Erro ao buscar o evento ${params.id}:`, error)
    return NextResponse.json({ error: "Falha ao buscar o evento" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const dadosEvento = await request.json()
    const eventoAtualizado = await updateEventInDB(params.id, dadosEvento)

    if (!eventoAtualizado) {
      return NextResponse.json({ error: "Evento não encontrado ou atualização falhou" }, { status: 404 })
    }

    return NextResponse.json(eventoAtualizado)
  } catch (error) {
    console.error(`Erro ao atualizar o evento ${params.id}:`, error)
    return NextResponse.json({ error: "Falha ao atualizar o evento" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const sucesso = await deleteEventFromDB(params.id)

    if (!sucesso) {
      return NextResponse.json({ error: "Evento não encontrado ou exclusão falhou" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Erro ao excluir o evento ${params.id}:`, error)
    return NextResponse.json({ error: "Falha ao excluir o evento" }, { status: 500 })
  }
}
