import { NextResponse } from "next/server"
import { fetchClientsFromDB, createClientInDB } from "../mongodb/actions"

export async function GET() {
  try {
    const clients = await fetchClientsFromDB()
    return NextResponse.json(clients.map(client => ({
      ...client,
      _id: client._id.toString(), // Convert ObjectId to string
    })))
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const clientData = await request.json()
    const newClient = await createClientInDB(clientData)

    if (!newClient) {
      return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
    }

    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}

