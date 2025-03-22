import type { Client, Event, LogEntry } from "./types"
import { getCurrentUser } from "./auth-service"

// Sample data
let clients: Client[] = [
  {
    id: "100001",
    name: "Maria Silva",
    document: "123.456.789-00",
    age: 35,
    address: "Rua das Flores, 123",
    children: 2,
    comments: "Cliente desde 2020",
  },
  {
    id: "100002",
    name: "João Oliveira",
    document: "987.654.321-00",
    age: 42,
    address: "Av. Principal, 456",
    children: 1,
    comments: "Prefere eventos aos finais de semana",
  },
  {
    id: "100003",
    name: "Empresa ABC Ltda",
    document: "12.345.678/0001-90",
    address: "Rua Comercial, 789",
    comments: "Eventos corporativos",
  },
  {
    id: "100004",
    name: "Ana Souza",
    document: "456.789.123-00",
    age: 28,
    address: "Rua das Palmeiras, 321",
    children: 0,
    comments: "Gosta de decorações coloridas",
  },
  {
    id: "100005",
    name: "Carlos Mendes",
    document: "789.123.456-00",
    age: 45,
    address: "Av. Central, 654",
    children: 3,
    comments: "Cliente VIP",
  },
]

let events: Event[] = [
  {
    id: "200001",
    name: "Aniversário 10 anos",
    date: "2023-12-15",
    clientId: "100001",
    balloon: {
      nationality: "Importado",
      customization: "Customizado",
      filling: "Muito Preenchimento",
      meters: 7,
      shine: 3,
    },
    specialBalloons: [
      {
        type: "Esphera",
        size: '18"',
        quantity: 5,
        price: 30,
      },
      {
        type: "Bubble com Confete",
        size: '24"',
        quantity: 2,
        price: 60,
      },
    ],
    totalPrice: 1470,
  },
  {
    id: "200002",
    name: "Festa Corporativa",
    date: "2023-11-20",
    clientId: "100003",
    balloon: {
      nationality: "Nacional",
      customization: "Meio a Meio",
      filling: "Bom Preenchimento",
      meters: 12,
      shine: 5,
    },
    specialBalloons: [
      {
        type: "Bubble Foil",
        size: "Tamanho Unico",
        quantity: 10,
        price: 20,
      },
    ],
    totalPrice: 1350,
  },
  {
    id: "200003",
    name: "Casamento",
    date: "2024-02-10",
    clientId: "100004",
    balloon: {
      nationality: "Importado",
      customization: "Customizado",
      filling: "Muito Preenchimento",
      meters: 15,
      shine: 8,
    },
    specialBalloons: [
      {
        type: "Bubble com Balão",
        size: '18"',
        quantity: 8,
        price: 40,
      },
      {
        type: "Esphera",
        size: '24"',
        quantity: 4,
        price: 40,
      },
    ],
    totalPrice: 3160,
  },
  {
    id: "200004",
    name: "Festa Infantil",
    date: "2024-01-05",
    clientId: "100002",
    balloon: {
      nationality: "Nacional",
      customization: "Customizado",
      filling: "Bom Preenchimento",
      meters: 5,
      shine: 2,
    },
    specialBalloons: [
      {
        type: "Bubble Simples",
        size: '11"',
        quantity: 15,
        price: 15,
      },
    ],
    totalPrice: 715,
  },
  {
    id: "200005",
    name: "Evento Empresarial",
    date: "2024-03-20",
    clientId: "100005",
    balloon: {
      nationality: "Importado",
      customization: "Meio a Meio",
      filling: "Médio Preenchimento",
      meters: 10,
      shine: 4,
    },
    specialBalloons: [],
    totalPrice: 1200,
  },
]

let logs: LogEntry[] = []

// Load data from localStorage if available
export const loadData = (): void => {
  try {
    const storedClients = localStorage.getItem("clients")
    const storedEvents = localStorage.getItem("events")
    const storedLogs = localStorage.getItem("logs")

    if (storedClients) {
      clients = JSON.parse(storedClients)
    }

    if (storedEvents) {
      events = JSON.parse(storedEvents)
    }

    if (storedLogs) {
      logs = JSON.parse(storedLogs)
    }
  } catch (error) {
    console.error("Error loading data from localStorage:", error)
  }
}

// Save data to localStorage
export const saveData = (): void => {
  try {
    localStorage.setItem("clients", JSON.stringify(clients))
    localStorage.setItem("events", JSON.stringify(events))
    localStorage.setItem("logs", JSON.stringify(logs))
  } catch (error) {
    console.error("Error saving data to localStorage:", error)
  }
}

// Initialize data on load
if (typeof window !== "undefined") {
  loadData()
}

// Generate a unique ID
export const generateId = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Log an action
export const logAction = (action: string, entityType: string, entityId: string, before?: any, after?: any): void => {
  const user = getCurrentUser()

  if (!user) {
    console.error("Cannot log action: No user is logged in")
    return
  }

  const logEntry: LogEntry = {
    id: generateId(),
    userId: user.id,
    action,
    entityType,
    entityId,
    timestamp: new Date().toISOString(),
    details: {
      before,
      after,
    },
  }

  logs.push(logEntry)
  saveData()
}

// Client operations
export const fetchClients = async (): Promise<Client[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [...clients]
}

export const fetchClient = async (id: string): Promise<Client> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const client = clients.find((c) => c.id === id)

  if (!client) {
    throw new Error(`Client with ID ${id} not found`)
  }

  return { ...client }
}

export const createClient = async (clientData: Omit<Client, "id">): Promise<Client> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newClient: Client = {
    id: generateId(),
    ...clientData,
  }

  clients.push(newClient)

  // Log the action
  logAction("create", "client", newClient.id, null, newClient)

  // Save to localStorage
  saveData()

  return { ...newClient }
}

export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const clientIndex = clients.findIndex((c) => c.id === id)

  if (clientIndex === -1) {
    throw new Error(`Client with ID ${id} not found`)
  }

  const oldClient = { ...clients[clientIndex] }

  // Update client
  clients[clientIndex] = {
    ...clients[clientIndex],
    ...clientData,
  }

  // Log the action
  logAction("update", "client", id, oldClient, clients[clientIndex])

  // Save to localStorage
  saveData()

  return { ...clients[clientIndex] }
}

export const deleteClient = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const clientIndex = clients.findIndex((c) => c.id === id)

  if (clientIndex === -1) {
    throw new Error(`Client with ID ${id} not found`)
  }

  const oldClient = { ...clients[clientIndex] }

  // Remove client
  clients = clients.filter((c) => c.id !== id)

  // Log the action
  logAction("delete", "client", id, oldClient, null)

  // Save to localStorage
  saveData()
}

// Event operations
export const fetchEvents = async (): Promise<Event[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [...events]
}

export const fetchEvent = async (id: string): Promise<Event> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const event = events.find((e) => e.id === id)

  if (!event) {
    throw new Error(`Event with ID ${id} not found`)
  }

  return { ...event }
}

export const fetchEventsByClient = async (clientId: string): Promise<Event[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return events.filter((e) => e.clientId === clientId)
}

export const createEvent = async (eventData: Omit<Event, "id">): Promise<Event> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newEvent: Event = {
    id: generateId(),
    ...eventData,
  }

  events.push(newEvent)

  // Log the action
  logAction("create", "event", newEvent.id, null, newEvent)

  // Save to localStorage
  saveData()

  return { ...newEvent }
}

export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const eventIndex = events.findIndex((e) => e.id === id)

  if (eventIndex === -1) {
    throw new Error(`Event with ID ${id} not found`)
  }

  const oldEvent = { ...events[eventIndex] }

  // Update event
  events[eventIndex] = {
    ...events[eventIndex],
    ...eventData,
  }

  // Log the action
  logAction("update", "event", id, oldEvent, events[eventIndex])

  // Save to localStorage
  saveData()

  return { ...events[eventIndex] }
}

export const deleteEvent = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const eventIndex = events.findIndex((e) => e.id === id)

  if (eventIndex === -1) {
    throw new Error(`Event with ID ${id} not found`)
  }

  const oldEvent = { ...events[eventIndex] }

  // Remove event
  events = events.filter((e) => e.id !== id)

  // Log the action
  logAction("delete", "event", id, oldEvent, null)

  // Save to localStorage
  saveData()
}

// Log operations
export const fetchLogs = async (): Promise<LogEntry[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [...logs]
}

