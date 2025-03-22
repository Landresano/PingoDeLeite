import { fetchUserByEmailFromDB } from "../mongodb/actions"

// Handlers para autenticação
export async function handleLogin(email: string, password: string) {
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
    return { success: false, error: "Authentication failed" }
  }
}

