"use server"

// Utilitários de autenticação - agora com funções assíncronas
export async function validateEmail(email: string): Promise<boolean> {
  try {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  } catch (error) {
    console.error("Error validating email:", error)
    return false
  }
}

export async function validatePassword(password: string): Promise<boolean> {
  try {
    return password.length >= 6
  } catch (error) {
    console.error("Error validating password:", error)
    return false
  }
}

