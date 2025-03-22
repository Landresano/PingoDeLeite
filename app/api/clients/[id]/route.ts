import { NextResponse } from "next/server"
import { fetchClientFromDB, updateClientInDB, deleteClientFromDB } from "../../mongodb/actions"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await fetchClientFromDB(params.id)

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error(`Error fetching client ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const clientData = await request.json()
    const updatedClient = await updateClientInDB(params.id, clientData)

    if (!updatedClient) {
      return NextResponse.json({ error: "Client not found or update failed" }, { status: 404 })
    }

    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error(`Error updating client ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const success = await deleteClientFromDB(params.id)

    if (!success) {
      return NextResponse.json({ error: "Client not found or delete failed" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting client ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
  }
}

