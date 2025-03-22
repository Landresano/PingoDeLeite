import type { Client, Event, LogEntry } from "./types"
import { getCurrentUser } from "./auth-service"

// Sample data
let clients: Client[] = [
  {
    id: "100001",
    nome: "Maria Silva",
    cpfCnpj: "123.456.789-00",
    idade: 35,
    endereco: "Rua das Flores, 123",
    filhos: 2,
    comentarios: "Cliente desde 2020",
  },
  {
    id: "100002",
    nome: "João Oliveira",
    cpfCnpj: "987.654.321-00",
    idade: 42,
    endereco: "Av. Principal, 456",
    filhos: 1,
    comentarios: "Prefere eventos aos finais de semana",
  },
  {
    id: "100003",
    nome: "Empresa ABC Ltda",
    cpfCnpj: "12.345.678/0001-90",
    endereco: "Rua Comercial, 789",
    comentarios: "Eventos corporativos",
  },
  {
    id: "100004",
    nome: "Ana Souza",
    cpfCnpj: "456.789.123-00",
    idade: 28,
    endereco: "Rua das Palmeiras, 321",
    filhos: 0,
    comentarios: "Gosta de decorações coloridas",
  },
  {
    id: "100005",
    nome: "Carlos Mendes",
    cpfCnpj: "789.123.456-00",
    idade: 45,
    endereco: "Av. Central, 654",
    filhos: 3,
    comentarios: "Cliente VIP",
  },
]

let events: Event[] = [
  {
    id: "200001",
    nome: "Aniversário 10 anos",
    data: "2023-12-15",
    clienteId: "100001",
    baloes: {
      nacionalidade: "Importado",
      customizacao: "Customizado",
      preenchimento: "Muito Preenchimento",
      metros: 7,
      shine: 3,
    },
    baloesEspeciais: [
      {
        tipo: "Esphera",
        tamanho: '18"',
        quantidade: 5,
        price: 30,
      },
      {
        tipo: "Bubble com Confete",
        tamanho: '24"',
        quantidade: 2,
        price: 60,
      },
    ],
    precoTotal: 1470,
    clienteNome: "",
    status: ""
  },
  {
    id: "200002",
    nome: "Festa Corporativa",
    data: "2023-11-20",
    clienteId: "100003",
    baloes: {
      nacionalidade: "Nacional",
      customizacao: "Meio a Meio",
      preenchimento: "Bom Preenchimento",
      metros: 12,
      shine: 5,
    },
    baloesEspeciais: [
      {
        tipo: "Bubble Foil",
        tamanho: "Tamanho Unico",
        quantidade: 10,
        price: 20,
      },
    ],
    precoTotal: 1350,
    clienteNome: "",
    status: ""
  },
  {
    id: "200003",
    nome: "Casamento",
    data: "2024-02-10",
    clienteId: "100004",
    baloes: {
      nacionalidade: "Importado",
      customizacao: "Customizado",
      preenchimento: "Muito Preenchimento",
      metros: 15,
      shine: 8,
    },
    baloesEspeciais: [
      {
        tipo: "Bubble com Balão",
        tamanho: '18"',
        quantidade: 8,
        price: 40,
      },
      {
        tipo: "Esphera",
        tamanho: '24"',
        quantidade: 4,
        price: 40,
      },
    ],
    precoTotal: 3160,
    clienteNome: "",
    status: ""
  },
  {
    id: "200004",
    nome: "Festa Infantil",
    data: "2024-01-05",
    clienteId: "100002",
    baloes: {
      nacionalidade: "Nacional",
      customizacao: "Customizado",
      preenchimento: "Bom Preenchimento",
      metros: 5,
      shine: 2,
    },
    baloesEspeciais: [
      {
        tipo: "Bubble Simples",
        tamanho: '11"',
        quantidade: 15,
        price: 15,
      },
    ],
    precoTotal: 715,
    clienteNome: "",
    status: ""
  },
  {
    id: "200005",
    nome: "Evento Empresarial",
    data: "2024-03-20",
    clienteId: "100005",
    baloes: {
      nacionalidade: "Importado",
      customizacao: "Meio a Meio",
      preenchimento: "Médio Preenchimento",
      metros: 10,
      shine: 4,
    },
    baloesEspeciais: [],
    precoTotal: 1200,
    clienteNome: "",
    status: ""
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
export const logAction = async (action: string, entityType: string, entityId: string, before?: any, after?: any): Promise<void> => {
  const user = await getCurrentUser()

  if (!user) {
    console.error("Cannot log action: No user is logged in");
    return;
  }
  const logEntry: LogEntry = {
    id: generateId(),
    userId: user.id,
    userName: user.name,
    action,
    timestamp: new Date().toISOString(),
    details: {
      before,
      after,
    },
    success: true
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

export const updataClient = async (id: string, clientData: Partial<Client>): Promise<Client> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const clientIndex = clients.findIndex((c) => c.id === id)

  if (clientIndex === -1) {
    throw new Error(`Client with ID ${id} not found`)
  }

  const oldClient = { ...clients[clientIndex] }

  // Updata client
  clients[clientIndex] = {
    ...clients[clientIndex],
    ...clientData,
  }

  // Log the action
  logAction("updata", "client", id, oldClient, clients[clientIndex])

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

export const fetchEventsByClient = async (clienteId: string): Promise<Event[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return events.filter((e) => e.clienteId === clienteId)
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

export const updataEvent = async (id: string, eventData: Partial<Event>): Promise<Event> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const eventIndex = events.findIndex((e) => e.id === id)

  if (eventIndex === -1) {
    throw new Error(`Event with ID ${id} not found`)
  }

  const oldEvent = { ...events[eventIndex] }

  // Updata event
  events[eventIndex] = {
    ...events[eventIndex],
    ...eventData,
  }

  // Log the action
  logAction("updata", "event", id, oldEvent, events[eventIndex])

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

