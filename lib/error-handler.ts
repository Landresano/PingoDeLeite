// Function to handle errors consistently across the application
export function handleError(error: any, toast: any, customMessage?: string): string {
  console.error("Error occurred:", error)

  // Extract error message
  let errorMessage = "An unknown error occurred"

  if (typeof error === "string") {
    errorMessage = error
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else if (error && typeof error === "object" && "message" in error) {
    errorMessage = String(error.message)
  }

  // Use custom message if provided
  const displayMessage = customMessage || errorMessage

  // Show toast notification
  if (toast) {
    try {
      toast({
        title: "Error",
        description: displayMessage,
        variant: "destructive",
      })
    } catch (toastError) {
      console.error("Error showing toast:", toastError)
    }
  }

  return displayMessage
}

// Function to log actions and provide feedback
export async function logAction(action: string, toast: any, success = true, details?: any): Promise<void> {
  const timestamp = new Date().toISOString()

  // Get current user
  let userId = "unknown"
  let userName = "unknown"

  try {
    const userJson = localStorage.getItem("current_user")
    if (userJson) {
      const user = JSON.parse(userJson)
      userId = user.id
      userName = user.name
    }
  } catch (error) {
    console.error("Error getting current user for logging:", error)
  }

  const logEntry = {
    id: Date.now().toString(),
    action,
    timestamp,
    success,
    userId,
    userName,
    details,
  }

  console.log("Action log:", logEntry)

  // Store in localStorage first
  try {
    const logs = JSON.parse(localStorage.getItem("action_logs") || "[]")
    logs.unshift(logEntry)
    localStorage.setItem("action_logs", JSON.stringify(logs.slice(0, 100))) // Keep last 100 logs
  } catch (localError) {
    console.error("Failed to save action log to localStorage:", localError)
  }

  // Try to store in MongoDB via API
  try {
    const response = await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logEntry),
      cache: "no-store", // Evitar cache
    })

    if (!response.ok) {
      console.error("Failed to save action log to API:", response.status)
    }
  } catch (apiError) {
    console.error("Failed to save action log to API:", apiError)
  }

  // Show feedback toast
  if (toast) {
    try {
      if (success) {
        toast({
          title: "Success",
          description: `${action} completed successfully`,
        })
      } else {
        toast({
          title: "Action Failed",
          description: `Failed to ${action.toLowerCase()}. ${details?.error || ""}`,
          variant: "destructive",
        })
      }
    } catch (toastError) {
      console.error("Error showing toast:", toastError)
    }
  }
}

