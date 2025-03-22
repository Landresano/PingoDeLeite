import { NextResponse } from "next/server"
import { fetchUserByEmailFromDB } from "../../mongodb/actions"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await fetchUserByEmailFromDB(email)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password before sending response
    const { password, ...safeUser } = user

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

