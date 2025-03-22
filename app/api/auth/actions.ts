"use server"

import { fetchUserByEmailFromDB } from "../mongodb/actions"

export async function authenticateUser(email: string, password: string) {
  try {
    const user = await fetchUserByEmailFromDB(email)

    if (!user || user.password !== password) {
      return { success: false, error: "Invalid email or password" }
    }

    // Remove password before returning user
    const { password: _, ...safeUser } = user

    return {
      success: true,
      user: safeUser,
      token: `token-${user.id}`,
    }
  } catch (error) {
    console.error("Error authenticating user:", error)
    throw error // Propagar o erro para permitir fallback para localStorage
  }
}

