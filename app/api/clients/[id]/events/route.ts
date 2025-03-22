import { NextResponse } from "next/server"
import { fetchEventsByClientFromDB } from "../../../mongodb/actions"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const events = await fetchEventsByClientFromDB(params.id)
    return NextResponse.json(events)
  } catch (error) {
    console.error(`Error fetching events for client ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch events for client" }, { status: 500 })
  }
}

