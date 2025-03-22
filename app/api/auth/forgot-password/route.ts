import { NextResponse } from "next/server"
import { fetchUserByEmailFromDB } from "../../mongodb/actions"
import { validateEmail } from "../utils"
import { getFromLocalStorage } from "@/lib/local-storage"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validar email
    try {
      const isEmailValid = await validateEmail(email)
      if (!isEmailValid) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
      }
    } catch (validationError) {
      console.error("Email validation error:", validationError)
      // Continue mesmo com erro de validação
    }

    // Check if user exists in MongoDB
    try {
      const user = await fetchUserByEmailFromDB(email)
      if (user) {
        // User found in MongoDB
        // In a real app, you would generate a token and send an email
        return NextResponse.json({ success: true })
      }
    } catch (dbError) {
      console.error("Database error when checking user:", dbError)
      // Continue para verificar no localStorage
    }

    // Check if user exists in localStorage
    try {
      const users = getFromLocalStorage("users") || []
      const user = users.find((u: any) => u.email === email)

      if (user) {
        // User found in localStorage
        // In a real app, you would generate a token and send an email
        return NextResponse.json({ success: true })
      }
    } catch (localError) {
      console.error("Error checking user in localStorage:", localError)
    }

    // For security reasons, don't reveal that the user doesn't exist
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing forgot password request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

