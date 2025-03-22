"use server"

import { MongoClient, ServerApiVersion } from "mongodb"

// MongoDB connection
let client: MongoClient | null = null
const uri = process.env.MONGODB_URI
const dbName = "PingoDeLeite"

// Collections
// Remover a exportação de objeto
const collections = {
  clients: "Clientes",
  events: "Eventos",
  users: "Users",
  logs: "Logs",
}

// Connect to MongoDB
async function connectToMongoDB() {
  if (!uri) {
    throw new Error("MongoDB URI not found in environment variables")
  }

  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
    await client.connect()
  }
  return client
}

// Check database connection
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await connectToMongoDB()
    await client.db(dbName).command({ ping: 1 })
    return true
  } catch (error) {
    console.error("MongoDB connection error:", error)
    return false
  }
}

// Fetch all clients
export async function fetchClientsFromDB() {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.clients)
    return await collection.find({}).toArray()
  } catch (error) {
    console.error("Error fetching clients:", error)
    return []
  }
}

// Fetch client by ID
export async function fetchClientFromDB(id: string) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.clients)
    return await collection.findOne({ id })
  } catch (error) {
    console.error("Error fetching client:", error)
    return null
  }
}

// Create client
export async function createClientInDB(clientData: any) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.clients)
    const result = await collection.insertOne(clientData)
    return { ...clientData, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating client:", error)
    return null
  }
}

// Update client
export async function updateClientInDB(id: string, clientData: any) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.clients)
    await collection.updateOne({ id }, { $set: clientData })
    return { ...clientData, id }
  } catch (error) {
    console.error("Error updating client:", error)
    return null
  }
}

// Delete client
export async function deleteClientFromDB(id: string) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.clients)
    await collection.deleteOne({ id })
    return true
  } catch (error) {
    console.error("Error deleting client:", error)
    return false
  }
}

// Fetch all events
export async function fetchEventsFromDB() {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    return await collection.find({}).toArray()
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}

// Fetch event by ID
export async function fetchEventFromDB(id: string) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    return await collection.findOne({ id })
  } catch (error) {
    console.error("Error fetching event:", error)
    return null
  }
}

// Fetch events by client ID
export async function fetchEventsByClientFromDB(clientId: string) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    return await collection.find({ clienteId: clientId }).toArray()
  } catch (error) {
    console.error("Error fetching events by client:", error)
    return []
  }
}

// Create event
export async function createEventInDB(eventData: any) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    const result = await collection.insertOne(eventData)
    return { ...eventData, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating event:", error)
    return null
  }
}

// Update event
export async function updateEventInDB(id: string, eventData: any) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    await collection.updateOne({ id }, { $set: eventData })
    return { ...eventData, id }
  } catch (error) {
    console.error("Error updating event:", error)
    return null
  }
}

// Delete event
export async function deleteEventFromDB(id: string) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    await collection.deleteOne({ id })
    return true
  } catch (error) {
    console.error("Error deleting event:", error)
    return false
  }
}

// Fetch users
export async function fetchUsersFromDB() {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.users)
    return await collection.find({}).toArray()
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

// Fetch user by email
export async function fetchUserByEmailFromDB(email: string) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.users)
    return await collection.findOne({ email })
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return null
  }
}

// Create user
export async function createUserInDB(userData: any) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.users)
    const result = await collection.insertOne(userData)
    return { ...userData, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

// Create log
export async function createLogInDB(logData: any) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.logs)
    const result = await collection.insertOne(logData)
    return { ...logData, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating log:", error)
    return null
  }
}

// Initialize database with sample data
export async function initializeSampleDataInDB(sampleData: any) {
  try {
    const client = await connectToMongoDB()
    const db = client.db(dbName)

    // Check if collections are empty
    const clientsCount = await db.collection(collections.clients).countDocuments()
    if (clientsCount === 0 && sampleData.clients && sampleData.clients.length > 0) {
      await db.collection(collections.clients).insertMany(sampleData.clients)
      console.log(`Initialized ${sampleData.clients.length} sample clients`)
    }

    const eventsCount = await db.collection(collections.events).countDocuments()
    if (eventsCount === 0 && sampleData.events && sampleData.events.length > 0) {
      await db.collection(collections.events).insertMany(sampleData.events)
      console.log(`Initialized ${sampleData.events.length} sample events`)
    }

    const usersCount = await db.collection(collections.users).countDocuments()
    if (usersCount === 0 && sampleData.users && sampleData.users.length > 0) {
      await db.collection(collections.users).insertMany(sampleData.users)
      console.log(`Initialized ${sampleData.users.length} sample users`)
    }

    return true
  } catch (error) {
    console.error("Error initializing sample data in MongoDB:", error)
    return false
  }
}

// Função auxiliar para obter os nomes das coleções
export async function getCollectionNames() {
  return {
    clients: collections.clients,
    events: collections.events,
    users: collections.users,
    logs: collections.logs,
  }
}

