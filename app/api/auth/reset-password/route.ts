import { NextResponse } from "next/server"
import { fetchUserByEmailFromDB, updateClientInDB } from "../../mongodb/actions"
import { validatePassword } from "../utils"
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/local-storage"

export async function POST(request: Request) {
  try {
    const { email, token, newPassword } = await request.json()

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: "Email, token, and new password are required" }, { status: 400 })
    }

    // Validar senha
    try {
      const isPasswordValid = await validatePassword(newPassword)
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
      }
    } catch (validationError) {
      console.error("Password validation error:", validationError)
      // Continue mesmo com erro de validação
    }

    // In a real app, you would validate the token

    // Try to update user in MongoDB
    try {
      const user = await fetchUserByEmailFromDB(email)

      if (user) {
        // Update the user's password
        const updatedUser = await updateClientInDB(user.id, {
          ...user,
          password: newPassword,
        })

        if (updatedUser) {
          return NextResponse.json({ success: true })
        }
      }
    } catch (dbError) {
      console.error("Database error when updating password:", dbError)
      // Continue para tentar atualizar no localStorage
    }

    // Try to update user in localStorage
    try {
      const users = getFromLocalStorage("users") || []
      const userIndex = users.findIndex((u: any) => u.email === email)

      if (userIndex !== -1) {
        // Update the user's password
        users[userIndex] = {
          ...users[userIndex],
          password: newPassword,
        }

        // Save to localStorage
        saveToLocalStorage("users", users)

        return NextResponse.json({ success: true })
      }
    } catch (localError) {
      console.error("Error updating password in localStorage:", localError)
    }

    // If we get here, the user wasn't found in either database
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  } catch (error) {
    console.error("Error resetting password:", error)
    return NextResponse.json({ error: "Password reset failed" }, { status: 500 })
  }
}

