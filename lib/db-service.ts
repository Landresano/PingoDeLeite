import { getFromLocalStorage, saveToLocalStorage } from "./local-storage"

// // Get MongoDB connection status from localStorage
// export function getConnectionState(): boolean {
//   try {
//     const statusJson = localStorage.getItem("mongodb_status")
//     if (statusJson) {
//       const status = JSON.parse(statusJson)
//       return status.isConnected
//     }
//     return false
//   } catch (error) {
//     console.error("Error getting MongoDB status:", error)
//     return false
//   }
// }

// Client-specific functions
export async function fetchClients() {
  try {
    // Try to fetch from API first
    const response = await fetch("/api/clients")
    if (response.ok) {
      const data = await response.json()
      // Update localStorage with the latest data
      saveToLocalStorage("clients", data)
      return data
    }
  } catch (error) {
    console.error("Error fetching clients from API:", error)
  }

  // Fallback to localStorage
  return getFromLocalStorage("clients") || []
}

export async function fetchClient(id: string) {
  try {
    // Try to fetch from API first
    const response = await fetch(`/api/clients/${id}`)
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error(`Error fetching client ${id} from API:`, error)
  }

  // Fallback to localStorage
  const clients = getFromLocalStorage("clients") || []
  const client = clients.find((c: any) => c.id === id)
  if (!client) {
    throw new Error(`Client with ID ${id} not found`)
  }
  return client
}

export async function createClient(clientData: any) {
  // Add to localStorage first
  const clients = getFromLocalStorage("clients") || []
  const newClient = {
    ...clientData,
    createdAt: new Date().toISOString(),
  }
  saveToLocalStorage("clients", [...clients, newClient])

  try {
    // Try to save to API
    const response = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClient),
    })

    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error("Error creating client via API:", error)
  }

  // Return the client from localStorage
  return newClient
}

export async function updateClient(id: string, clientData: any) {
  // Update localStorage first
  const clients = getFromLocalStorage("clients") || []
  const index = clients.findIndex((c: any) => c.id === id)

  if (index === -1) {
    throw new Error(`Client with ID ${id} not found`)
  }

  const updatedClient = {
    ...clients[index],
    ...clientData,
    updatedAt: new Date().toISOString(),
  }

  clients[index] = updatedClient
  saveToLocalStorage("clients", clients)

  try {
    // Try to update via API
    const response = await fetch(`/api/clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedClient),
    })

    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error(`Error updating client ${id} via API:`, error)
  }

  // Return the client from localStorage
  return updatedClient
}

export async function deleteClient(id: string) {
  // Delete from localStorage first
  const clients = getFromLocalStorage("clients") || []
  const filteredClients = clients.filter((c: any) => c.id !== id)
  saveToLocalStorage("clients", filteredClients)

  try {
    // Try to delete via API
    const response = await fetch(`/api/clients/${id}`, {
      method: "DELETE",
    })

    return response.ok
  } catch (error) {
    console.error(`Error deleting client ${id} via API:`, error)
    return true // Return true since localStorage was updated
  }
}

// Event-specific functions
export async function fetchEvents() {
  try {
    // Try to fetch from API first
    const response = await fetch("/api/events")
    if (response.ok) {
      const data = await response.json()
      // Update localStorage with the latest data
      saveToLocalStorage("events", data)
      return data
    }
  } catch (error) {
    console.error("Error fetching events from API:", error)
  }

  // Fallback to localStorage
  return getFromLocalStorage("events") || []
}

export async function fetchEvent(id: string) {
  try {
    // Try to fetch from API first
    const response = await fetch(`/api/events/${id}`)
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error(`Error fetching event ${id} from API:`, error)
  }

  // Fallback to localStorage
  const events = getFromLocalStorage("events") || []
  const event = events.find((e: any) => e.id === id)
  if (!event) {
    throw new Error(`Event with ID ${id} not found`)
  }
  return event
}

export async function fetchEventsByClient(clientId: string) {
  try {
    // Try to fetch from API first
    const response = await fetch(`/api/clients/${clientId}/events`)
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error(`Error fetching events for client ${clientId} from API:`, error)
  }

  // Fallback to localStorage
  const events = getFromLocalStorage("events") || []
  return events.filter((e: any) => e.clienteId === clientId)
}

export async function createEvent(eventData: any) {
  // Add to localStorage first
  const events = getFromLocalStorage("events") || []
  const newEvent = {
    ...eventData,
    createdAt: new Date().toISOString(),
  }
  saveToLocalStorage("events", [...events, newEvent])

  try {
    // Try to save to API
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    })

    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error("Error creating event via API:", error)
  }

  // Return the event from localStorage
  return newEvent
}

export async function updateEvent(id: string, eventData: any) {
  // Update localStorage first
  const events = getFromLocalStorage("events") || []
  const index = events.findIndex((e: any) => e.id === id)

  if (index === -1) {
    throw new Error(`Event with ID ${id} not found`)
  }

  const updatedEvent = {
    ...events[index],
    ...eventData,
    updatedAt: new Date().toISOString(),
  }

  events[index] = updatedEvent
  saveToLocalStorage("events", events)

  try {
    // Try to update via API
    const response = await fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent),
    })

    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error(`Error updating event ${id} via API:`, error)
  }

  // Return the event from localStorage
  return updatedEvent
}

export async function deleteEvent(id: string) {
  // Delete from localStorage first
  const events = getFromLocalStorage("events") || []
  const filteredEvents = events.filter((e: any) => e.id !== id)
  saveToLocalStorage("events", filteredEvents)

  try {
    // Try to delete via API
    const response = await fetch(`/api/events/${id}`, {
      method: "DELETE",
    })

    return response.ok
  } catch (error) {
    console.error(`Error deleting event ${id} via API:`, error)
    return true // Return true since localStorage was updated
  }
}

// User-specific functions
export async function fetchUsers() {
  try {
    // Try to fetch from API first
    const response = await fetch("/api/users")
    if (response.ok) {
      const data = await response.json()
      // Update localStorage with the latest data
      saveToLocalStorage("users", data)
      return data
    }
  } catch (error) {
    console.error("Error fetching users from API:", error)
  }

  // Fallback to localStorage
  return getFromLocalStorage("users") || []
}

export async function fetchUserByEmail(email: string) {
  try {
    // Try to fetch from API first
    const response = await fetch(`/api/users/by-email?email=${encodeURIComponent(email)}`)
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error(`Error fetching user by email ${email} from API:`, error)
  }

  // Fallback to localStorage
  const users = getFromLocalStorage("users") || []
  return users.find((u: any) => u.email === email) || null
}

export async function createUser(userData: any) {
  // Add to localStorage first
  const users = getFromLocalStorage("users") || []
  const newUser = {
    ...userData,
    createdAt: new Date().toISOString(),
  }
  saveToLocalStorage("users", [...users, newUser])

  try {
    // Try to save to API
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })

    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error("Error creating user via API:", error)
  }

  // Return the user from localStorage
  return newUser
}

// Log-specific functions
export async function createLog(logData: any) {
  // Add to localStorage first
  const logs = getFromLocalStorage("logs") || []
  const newLog = {
    ...logData,
    timestamp: new Date().toISOString(),
  }
  logs.unshift(newLog)
  saveToLocalStorage("logs", logs.slice(0, 100)) // Keep last 100 logs

  try {
    // Try to save to API
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLog),
    })
  } catch (error) {
    console.error("Error creating log via API:", error)
  }

  return newLog
}


export async function fetchUserByEmailFromDB(email: string) {
  try {
    // Try to fetch from API first
    const response = await fetch(`/api/users/by-email?email=${encodeURIComponent(email)}`)
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error(`Error fetching user by email ${email} from API:`, error)
  }

  // Fallback to localStorage
  const users = getFromLocalStorage("users") || []
  return users.find((u: any) => u.email === email) || null
}

export async function createUserInDB(userData: any) {
  try {
    // Try to save to API
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error("Error creating user via API:", error)
  }

  // Fallback to localStorage
  return userData
}

