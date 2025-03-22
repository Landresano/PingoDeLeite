import { NextResponse } from "next/server"
import { fetchUsersFromDB, createUserInDB, fetchUserByEmailFromDB } from "../mongodb/actions"

export async function GET() {
  try {
    const users = await fetchUsersFromDB()

    // Remove passwords before sending to client
    const safeUsers = users.map((user) => {
      const { password, ...safeUser } = user
      return safeUser
    })

    return NextResponse.json(safeUsers)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userData = await request.json()

    // Check if user with this email already exists
    const existingUser = await fetchUserByEmailFromDB(userData.email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    const newUser = await createUserInDB(userData)

    if (!newUser) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Remove password before sending response
    const { password, ...safeUser } = newUser

    return NextResponse.json(safeUser, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

