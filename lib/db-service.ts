import { getFromLocalStorage, saveToLocalStorage } from "./local-storage"

// Get MongoDB connection status from localStorage
export function getConnectionState(): boolean {
  try {
    const statusJson = localStorage.getItem("mongodb_status")
    if (statusJson) {
      const status = JSON.parse(statusJson)
      return status.isConnected
    }
    return false
  } catch (error) {
    console.error("Error getting MongoDB status:", error)
    return false
  }
}

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

// Initialize sample data if needed
export function initializeSampleData() {
  // Check if data already exists
  const clients = getFromLocalStorage("clients")
  const events = getFromLocalStorage("events")
  const users = getFromLocalStorage("users")

  // If no data exists, initialize with sample data
  if (!clients) {
    const sampleClients = [
      {
        id: "100001",
        nome: "Maria Silva",
        cpfCnpj: "123.456.789-00",
        idade: 35,
        endereco: "Rua das Flores, 123 - São Paulo, SP",
        filhos: 2,
        comentarios: "Cliente fiel, prefere decorações coloridas",
        createdAt: new Date().toISOString(),
      },
      {
        id: "100002",
        nome: "Empresa ABC Ltda",
        cpfCnpj: "12.345.678/0001-90",
        idade: null,
        endereco: "Av. Paulista, 1000 - São Paulo, SP",
        filhos: 0,
        comentarios: "Empresa que realiza eventos corporativos mensalmente",
        createdAt: new Date().toISOString(),
      },
      {
        id: "100003",
        nome: "João Pereira",
        cpfCnpj: "987.654.321-00",
        idade: 42,
        endereco: "Rua dos Pinheiros, 500 - São Paulo, SP",
        filhos: 3,
        comentarios: "Prefere eventos mais simples e elegantes",
        createdAt: new Date().toISOString(),
      },
      {
        id: "100004",
        nome: "Ana Beatriz Costa",
        cpfCnpj: "456.789.123-00",
        idade: 28,
        endereco: "Alameda Santos, 45 - São Paulo, SP",
        filhos: 1,
        comentarios: "Gosta de temas infantis elaborados",
        createdAt: new Date().toISOString(),
      },
      {
        id: "100005",
        nome: "Restaurante Sabor & Cia",
        cpfCnpj: "98.765.432/0001-10",
        idade: null,
        endereco: "Rua Augusta, 789 - São Paulo, SP",
        filhos: 0,
        comentarios: "Parceiro para eventos gastronômicos",
        createdAt: new Date().toISOString(),
      },
    ]

    saveToLocalStorage("clients", sampleClients)
  }

  if (!events) {
    // Create sample events based on the sample clients
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const nextMonth = new Date(today)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    // Update the sample events to include status
    const sampleEvents = [
      {
        id: "200001",
        data: today.toISOString(),
        nome: "Aniversário de 10 anos",
        clienteId: "100001",
        clienteNome: "Maria Silva",
        status: "Finalizada",
        baloes: {
          nacionalidade: "Nacional",
          customizacao: "Customizado",
          preenchimento: "Bom Preenchimento",
          metros: 5,
          shine: 2,
        },
        baloesEspeciais: [
          {
            tipo: "Esphera",
            tamanho: '18"',
            quantidade: 3,
          },
          {
            tipo: "Bubble com Balão",
            tamanho: '24"',
            quantidade: 2,
          },
        ],
        precoTotal: 655,
        createdAt: new Date().toISOString(),
      },
      {
        id: "200002",
        data: tomorrow.toISOString(),
        nome: "Evento Corporativo",
        clienteId: "100002",
        clienteNome: "Empresa ABC Ltda",
        status: "Paga",
        baloes: {
          nacionalidade: "Importado",
          customizacao: "Meio a Meio",
          preenchimento: "Muito Preenchimento",
          metros: 10,
          shine: 5,
        },
        baloesEspeciais: [
          {
            tipo: "Bubble Simples",
            tamanho: '24"',
            quantidade: 5,
          },
        ],
        precoTotal: 1880,
        createdAt: new Date().toISOString(),
      },
      {
        id: "200003",
        data: nextWeek.toISOString(),
        nome: "Festa de Formatura",
        clienteId: "100003",
        clienteNome: "João Pereira",
        status: "Fechada",
        baloes: {
          nacionalidade: "Importado",
          customizacao: "Customizado",
          preenchimento: "Médio Preenchimento",
          metros: 8,
          shine: 3,
        },
        baloesEspeciais: [
          {
            tipo: "Bubble com Confete",
            tamanho: '18"',
            quantidade: 4,
          },
        ],
        precoTotal: 1220,
        createdAt: new Date().toISOString(),
      },
      {
        id: "200004",
        data: nextMonth.toISOString(),
        nome: "Festa Infantil",
        clienteId: "100004",
        clienteNome: "Ana Beatriz Costa",
        status: "Orçamento",
        baloes: {
          nacionalidade: "Nacional",
          customizacao: "Customizado",
          preenchimento: "Muito Preenchimento",
          metros: 6,
          shine: 4,
        },
        baloesEspeciais: [
          {
            tipo: "Bubble Foil",
            tamanho: "Tamanho Unico",
            quantidade: 10,
          },
        ],
        precoTotal: 884,
        createdAt: new Date().toISOString(),
      },
      {
        id: "200005",
        data: nextMonth.toISOString(),
        nome: "Festival Gastronômico",
        clienteId: "100005",
        clienteNome: "Restaurante Sabor & Cia",
        status: "Orçamento",
        baloes: {
          nacionalidade: "Importado",
          customizacao: "Sem Customização",
          preenchimento: "Pouco Preenchimento",
          metros: 12,
          shine: 0,
        },
        baloesEspeciais: [
          {
            tipo: "Esphera",
            tamanho: '24"',
            quantidade: 8,
          },
        ],
        precoTotal: 1100,
        createdAt: new Date().toISOString(),
      },
    ]

    saveToLocalStorage("events", sampleEvents)
  }

  if (!users) {
    const sampleUsers = [
      {
        id: "1",
        name: "Admin",
        email: "admin@example.com",
        password: "password",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Test User",
        email: "teste",
        password: "teste",
        createdAt: new Date().toISOString(),
      },
    ]

    saveToLocalStorage("users", sampleUsers)
  }
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

