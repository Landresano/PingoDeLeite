import { NextResponse } from "next/server"
import { fetchUserByEmailFromDB } from "../../mongodb/actions"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
  }

  try {
    const user = await fetchUserByEmailFromDB(email)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password before sending response
    const { password, ...safeUser } = user

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error(`Error fetching user by email ${email}:`, error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

