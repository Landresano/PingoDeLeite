import { NextResponse } from "next/server"
import { fetchUserByEmailFromDB, updateClientInDB } from "../../mongodb/actions"
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/local-storage"

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json()

    if (!email || !token) {
      return NextResponse.json({ error: "Email and token are required" }, { status: 400 })
    }

    // In a real app, you would validate the token

    // Try to update user in MongoDB
    try {
      const user = await fetchUserByEmailFromDB(email)

      if (user) {
        // Update the user's email verification status
        const updatedUser = await updateClientInDB(user.id, {
          ...user,
          emailVerified: true,
        })

        if (updatedUser) {
          return NextResponse.json({ success: true })
        }
      }
    } catch (dbError) {
      console.error("Database error when verifying email:", dbError)
      // Continue para tentar atualizar no localStorage
    }

    // Try to update user in localStorage
    try {
      const users = getFromLocalStorage("users") || []
      const userIndex = users.findIndex((u: any) => u.email === email)

      if (userIndex !== -1) {
        // Update the user's email verification status
        users[userIndex] = {
          ...users[userIndex],
          emailVerified: true,
        }

        // Save to localStorage
        saveToLocalStorage("users", users)

        return NextResponse.json({ success: true })
      }
    } catch (localError) {
      console.error("Error verifying email in localStorage:", localError)
    }

    // If we get here, the user wasn't found in either database
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  } catch (error) {
    console.error("Error verifying email:", error)
    return NextResponse.json({ error: "Email verification failed" }, { status: 500 })
  }
}

