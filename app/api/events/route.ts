import { NextResponse } from "next/server"
import { fetchEventsFromDB, createEventInDB } from "../mongodb/actions"

export async function GET() {
  try {
    const events = await fetchEventsFromDB()
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const eventData = await request.json()
    const newEvent = await createEventInDB(eventData)

    if (!newEvent) {
      return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
    }

    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}

