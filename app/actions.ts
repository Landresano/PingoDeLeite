"use server"

import { MongoClient, ServerApiVersion } from "mongodb"

// Conexão com o MongoDB
let client: MongoClient | null = null
const uri = process.env.MONGODB_URI
const dbName = "PingoDeLeite"

// Coleções
const collections = {
  clients: "Clientes",
  events: "Eventos",
  users: "Users",
  logs: "Logs",
}

// Conectar ao MongoDB
async function connectToMongoDB() {
  if (!uri) {
    throw new Error("URI do MongoDB não encontrada nas variáveis de ambiente")
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

// Verificar conexão com o banco de dados
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await connectToMongoDB()
    await client.db(dbName).command({ ping: 1 })
    return true
  } catch (error) {
    console.error("Erro de conexão com o MongoDB:", error)
    return false
  }
}

// Buscar todos os clientes
export async function fetchClientsFromDB() {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.clients)
    return await collection.find({}).toArray()
  } catch (error) {
    console.error("Erro ao buscar clientes:", error)
    return []
  }
}

// Buscar cliente por ID
export async function fetchClientFromDB(id: string) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.clients)
    return await collection.findOne({ id })
  } catch (error) {
    console.error("Erro ao buscar cliente:", error)
    return null
  }
}

// Criar cliente
export async function createClientInDB(clientData: any) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.clients)
    const result = await collection.insertOne(clientData)
    return { ...clientData, _id: result.insertedId }
  } catch (error) {
    console.error("Erro ao criar cliente:", error)
    return null
  }
}

// Atualizar cliente
export async function updateClientInDB(id: string, clientData: any) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.clients)
    await collection.updateOne({ id }, { $set: clientData })
    return { ...clientData, id }
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error)
    return null
  }
}

// Deletar cliente
export async function deleteClientFromDB(id: string) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.clients)
    await collection.deleteOne({ id })
    return true
  } catch (error) {
    console.error("Erro ao deletar cliente:", error)
    return false
  }
}

// Buscar todos os eventos
export async function fetchEventsFromDB() {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    return await collection.find({}).toArray()
  } catch (error) {
    console.error("Erro ao buscar eventos:", error)
    return []
  }
}

// Buscar evento por ID
export async function fetchEventFromDB(id: string) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    return await collection.findOne({ id })
  } catch (error) {
    console.error("Erro ao buscar evento:", error)
    return null
  }
}

// Buscar eventos por ID do cliente
export async function fetchEventsByClientFromDB(clientId: string) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    return await collection.find({ clienteId: clientId }).toArray()
  } catch (error) {
    console.error("Erro ao buscar eventos por cliente:", error)
    return []
  }
}

// Criar evento
export async function createEventInDB(eventData: any) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    const result = await collection.insertOne(eventData)
    return { ...eventData, _id: result.insertedId }
  } catch (error) {
    console.error("Erro ao criar evento:", error)
    return null
  }
}

// Atualizar evento
export async function updateEventInDB(id: string, eventData: any) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    await collection.updateOne({ id }, { $set: eventData })
    return { ...eventData, id }
  } catch (error) {
    console.error("Erro ao atualizar evento:", error)
    return null
  }
}

// Deletar evento
export async function deleteEventFromDB(id: string) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    await collection.deleteOne({ id })
    return true
  } catch (error) {
    console.error("Erro ao deletar evento:", error)
    return false
  }
}

// Buscar usuários
export async function fetchUsersFromDB() {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.users)
    return await collection.find({}).toArray()
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return []
  }
}

// Buscar usuário por email
export async function fetchUserByEmailFromDB(email: string) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.users)
    return await collection.findOne({ email })
  } catch (error) {
    console.error("Erro ao buscar usuário por email:", error)
    return null
  }
}

// Criar usuário
export async function createUserInDB(userData: any) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.users)
    const result = await collection.insertOne(userData)
    return { ...userData, _id: result.insertedId }
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return null
  }
}

// Criar log
export async function createLogInDB(logData: any) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.logs)
    const result = await collection.insertOne(logData)
    return { ...logData, _id: result.insertedId }
  } catch (error) {
    console.error("Erro ao criar log:", error)
    return null
  }
}

// // Inicializar banco de dados com dados de exemplo
// export async function initializeSampleDataInDB(sampleData: any) {
//   try {
//     const client = await connectToMongoDB()
//     const db = client.db(dbName)

//     // Verificar se as coleções estão vazias
//     const clientsCount = await db.collection(collections.clients).countDocuments()
//     if (clientsCount === 0 && sampleData.clients && sampleData.clients.length > 0) {
//       await db.collection(collections.clients).insertMany(sampleData.clients)
//       console.log(`Inicializados ${sampleData.clients.length} clientes de exemplo`)
//     }

//     const eventsCount = await db.collection(collections.events).countDocuments()
//     if (eventsCount === 0 && sampleData.events && sampleData.events.length > 0) {
//       await db.collection(collections.events).insertMany(sampleData.events)
//       console.log(`Inicializados ${sampleData.events.length} eventos de exemplo`)
//     }

//     const usersCount = await db.collection(collections.users).countDocuments()
//     if (usersCount === 0 && sampleData.users && sampleData.users.length > 0) {
//       await db.collection(collections.users).insertMany(sampleData.users)
//       console.log(`Inicializados ${sampleData.users.length} usuários de exemplo`)
//     }

//     return true
//   } catch (error) {
//     console.error("Erro ao inicializar dados de exemplo no MongoDB:", error)
//     return false
//   }
// }

// Função auxiliar para obter os nomes das coleções
export async function getCollectionNames() {
  return {
    clients: collections.clients,
    events: collections.events,
    users: collections.users,
    logs: collections.logs,
  }
}
