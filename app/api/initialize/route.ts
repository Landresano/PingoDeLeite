import { NextResponse } from "next/server"
import { initializeSampleDataInDB } from "../mongodb/actions"

export async function POST(request: Request) {
  try {
    const sampleData = await request.json()
    const success = await initializeSampleDataInDB(sampleData)

    return NextResponse.json({ success })
  } catch (error) {
    console.error("Error initializing sample data:", error)
    return NextResponse.json({ error: "Failed to initialize sample data" }, { status: 500 })
  }
}

