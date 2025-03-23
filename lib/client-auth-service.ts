import { getFromLocalStorage, saveToLocalStorage } from "./local-storage"

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("current_user")
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

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

// export const initializeDefaultUsers = () => {
//   // Check if users already exist
//   const users = getFromLocalStorage("users")

//   if (!users || users.length === 0) {
//     // Create a default admin user
//     const defaultUsers = [
//       {
//         id: "1",
//         name: "Admin",
//         email: "admin@example.com",
//         password: "password",
//         createdAt: new Date().toISOString(),
//       },
//       {
//         id: "2",
//         name: "Test User",
//         email: "teste",
//         password: "teste",
//         createdAt: new Date().toISOString(),
//       },
//     ]

//     saveToLocalStorage("users", defaultUsers)
//   }
// }

export async function registerUser(name: string, email: string, password: string) {
  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Registration failed:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in registerUser:", error);
    return false;
  }
}

export const loginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    // Try to login via API
    try {
      console.log("Sending login request to API")
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store", // Evitar cache
      })

      console.log("Login API response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Login API response data:", data)

        if (data.success) {
          // Store auth token in localStorage
          localStorage.setItem("auth_token", data.token || "sample-token")
          localStorage.setItem("current_user", JSON.stringify(data.user))
          return true
        }
      } else {
        const errorText = await response.text()
        console.error("API login failed with status:", response.status, errorText)
      }
    } catch (apiError) {
      console.error("API login failed, falling back to localStorage:", apiError)
      // Continue to localStorage fallback
    }

    // Fallback to localStorage
    console.log("Falling back to localStorage authentication")
    const users = getFromLocalStorage("users") || []
    const user = users.find((u: any) => u.email === email && u.password === password)

    if (user) {
      console.log("localStorage authentication successful")
      // Store auth token in localStorage
      localStorage.setItem("auth_token", `token-${user.id}`)
      localStorage.setItem(
        "current_user",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
        }),
      )

      return true
    }

    console.log("Authentication failed")
    return false
  } catch (error) {
    console.error("Error logging in:", error)

    // Final fallback to localStorage
    try {
      console.log("Final fallback to localStorage")
      const users = getFromLocalStorage("users") || []
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (user) {
        console.log("Final fallback authentication successful")
        // Store auth token in localStorage
        localStorage.setItem("auth_token", `token-${user.id}`)
        localStorage.setItem(
          "current_user",
          JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
          }),
        )

        return true
      }

      return false
    } catch (localError) {
      console.error("Error logging in from localStorage:", localError)
      return false
    }
  }
}

