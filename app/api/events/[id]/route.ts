import { NextResponse } from "next/server"
import { fetchEventFromDB, updateEventInDB, deleteEventFromDB } from "../../mongodb/actions"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const event = await fetchEventFromDB(params.id)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error(`Error fetching event ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventData = await request.json()
    const updatedEvent = await updateEventInDB(params.id, eventData)

    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found or update failed" }, { status: 404 })
    }

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error(`Error updating event ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const success = await deleteEventFromDB(params.id)

    if (!success) {
      return NextResponse.json({ error: "Event not found or delete failed" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting event ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}

