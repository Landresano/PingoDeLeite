import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "../client"

export async function GET() {
  try {
    // Add a timeout to the database check
    const timeoutPromise = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        console.log("Database check timed out")
        resolve(false)
      }, 3000)
    })

    const connectionPromise = checkDatabaseConnection().catch((error) => {
      console.error("Error in checkDatabaseConnection:", error)
      return false
    })

    const isConnected = await Promise.race([connectionPromise, timeoutPromise])

    return NextResponse.json({
      status: isConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error checking MongoDB status:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to check MongoDB connection",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

