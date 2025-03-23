import { NextResponse } from "next/server"
import { fetchClientFromDB, updateClientInDB, deleteClientFromDB } from "../../mongodb/actions"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await fetchClientFromDB(params.id)

    if (!client) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error(`Erro ao buscar cliente ${params.id}:`, error)
    return NextResponse.json({ error: "Falha ao buscar cliente" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const clientData = await request.json()
    const updatedClient = await updateClientInDB(params.id, clientData)

    if (!updatedClient) {
      return NextResponse.json({ error: "Cliente não encontrado ou atualização falhou" }, { status: 404 })
    }

    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error(`Erro ao atualizar cliente ${params.id}:`, error)
    return NextResponse.json({ error: "Falha ao atualizar cliente" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const success = await deleteClientFromDB(params.id)

    if (!success) {
      return NextResponse.json({ error: "Cliente não encontrado ou exclusão falhou" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Erro ao excluir cliente ${params.id}:`, error)
    return NextResponse.json({ error: "Falha ao excluir cliente" }, { status: 500 })
  }
}
