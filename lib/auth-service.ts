"use server"

// Todas as funções em arquivos com 'use server' devem ser assíncronas
import { cookies } from "next/headers";
import { fetchUserByEmailFromDB  } from "@/app/api/mongodb/actions" // Import MongoDB actions
import jwt from "jsonwebtoken"; // If using JWT for authentication

export const getCurrentUser = async () => {
  try {
    // Get token from cookies
    const token = cookies().get("auth_token")?.value;

    if (!token) {
      return null; // No user logged in
    }

    // Decode token (Replace 'your-secret-key' with your actual secret)
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded || !decoded.email) {
      return null;
    }

    // Fetch user from database
    const user = await fetchUserByEmailFromDB(decoded.email);

    // Return user data, excluding sensitive info
    if (user) {
      const safeUser = { ...user }; // Adjusted to avoid destructuring a non-existent property
      return safeUser;
    }

    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};



export const sendPasswordResetEmail = async (email: string) => {
  // In a real application, this function would:
  // 1. Generate a unique password reset token.
  // 2. Store the token associated with the user's email in a database.
  // 3. Send an email to the user with a link to reset their password,
  //    including the token as a query parameter.

  // This is a placeholder implementation.
  console.log(`Password reset email sent to: ${email}`)
  return Promise.resolve()
}

// export const initializeDefaultUsers = async () => {
//   // Como estamos em um Server Action, não podemos acessar localStorage diretamente
//   // Esta função deve ser chamada do cliente
//   return
// }

export const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
  try {
    // Como estamos em um Server Action, não podemos acessar localStorage diretamente
    // Em um ambiente real, você usaria um banco de dados
    return true
  } catch (error) {
    console.error("Error registering user:", error)
    return false
  }
}

