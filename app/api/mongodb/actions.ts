"use server"

import { NextResponse } from "next/server";
import { connectToMongoDB, closeMongoDB } from "./client"
import { dbName, collections } from "./config"
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import type Client from "@/lib/types"
import type Event from "@/lib/types";
import type User from "@/lib/types";
import { handleError } from "@/lib/error-handler";



// Buscar todos os clientes
export async function fetchClientsFromDB(): Promise<Client[] | null> {
  try {
    const client = await connectToMongoDB();
    const collection = client.db(dbName).collection(collections.clients);
    return await collection.find({}).toArray() as Client[];
  } catch (error) {
    console.error("Erro ao buscar clientes:", error)
    return []
  }
  finally {
    closeMongoDB();
  }
}

// Buscar cliente por ID
export async function fetchClientFromDB(id: string): Promise<Client | null> {
  try {
    const client = await connectToMongoDB();
    const collection = client.db(dbName).collection(collections.clients);
    const foundClient = await collection.findOne({ _id: new ObjectId(id) });
    return foundClient ? { ...foundClient } as Client : null;
  } catch (error) {
    console.error("Erro ao buscar cliente por ID:", error);
    return null;
  }
  finally {
    closeMongoDB();
  }
}

// Criar cliente
export async function createClientInDB(clientData: any): Promise<Client | null> {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.clients)
    const result = await collection.insertOne(clientData)
    return { ...clientData, _id: result.insertedId.toString() }
  } catch (error) {
    console.error("Erro ao criar cliente:", error)
    return null
  }
  finally {
    closeMongoDB();
  }
}

// Atualizar cliente
export async function updateClientInDB(id: string, clientData: any): Promise<Boolean> {
  try {
    const client = await connectToMongoDB();
    const collection = client.db(dbName).collection(collections.clients);

    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: clientData });
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return false;
  }
  finally {
    closeMongoDB();
  }
}

// Deletar cliente
export async function deleteClientFromDB(id: string): Promise<Boolean> {
  try {
    const client = await connectToMongoDB();
    const collection = client.db(dbName).collection(collections.clients);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    return false;
  }
  finally {
    closeMongoDB();
  }
}

// Buscar todos os eventos
export async function fetchEventsFromDB(): Promise<Event[]> {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    return await collection.find({}).toArray() as Event[]
  } catch (error) {
    console.error("Erro ao buscar eventos:", error)
    return []
  }
  finally {
    closeMongoDB();
  }
}

// Buscar evento por ID
export async function fetchEventFromDB(id: string): Promise<Event | null> {
  try {
    const client = await connectToMongoDB();
    const collection = client.db(dbName).collection(collections.events);
    const foundEvent = await collection.findOne({ _id: new ObjectId(id) });
    return foundEvent as Event;//? ({ ...foundEvent, _id: foundEvent._id.toString() } as unknown as Event) : null;
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    return null;
  } finally {
    closeMongoDB();
  }
}

// Buscar eventos por ID do cliente
export async function fetchEventsByClientFromDB(clientId: string): Promise<Event[]> {
  try {
    const client = await connectToMongoDB();
    const collection = client.db(dbName).collection(collections.events);
    const events = await collection.find({ clienteId: clientId }).toArray();
    return events as Event[];
  } catch (error) {
    console.error("Erro ao buscar eventos por cliente:", error);
    return [];
  }
  finally {
    closeMongoDB();
  }
}

// Criar evento
export async function createEventInDB(eventData: Event): Promise<Event | null> {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    const result = await collection.insertOne(eventData);
    if (result.acknowledged && result.insertedId) {
      console.log("Evento criado com sucesso:", result.insertedId);
      return eventData;
    } else {
      console.error("Falha ao criar o evento.");
      return null;
    }
  } catch (error) {
    console.error("Erro ao criar evento:", error)
    return null
  }
  finally {
    closeMongoDB();
  }
}

// Atualizar evento
export async function updateEventInDB(id: string, eventData: any): Promise<Boolean>{
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: eventData });
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return false;
  }
  finally {
    closeMongoDB();
  }
}

// Deletar evento
export async function deleteEventFromDB(id: string): Promise<Boolean> {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    return false;
  }
  finally {
    closeMongoDB();
  }
}

// Buscar usuários
export async function fetchUsersFromDB(): Promise<User[]> {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.users)
    return await collection.find({}).toArray() as User[]
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return []
  }
  finally {
    closeMongoDB();
  }
}

// Buscar usuário por email
export async function fetchUserByEmailFromDB(email: string): Promise<User | null> {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.users)
    const foundUser = await collection.findOne({ email })
    return foundUser as User;
  } catch (error) {
    console.error("Erro ao buscar usuário por email:", error)
    return null
  }
  finally {
    closeMongoDB();
  }
}

// Criar usuário
export async function createUserInDB(userData: any) {
  try {
    const client = await connectToMongoDB()
    const existingUser = await client.db(dbName).collection(collections.users).findOne({ email: userData.email });

    if (existingUser) {
      return NextResponse.json({ error: "Email já está em uso" }, { status: 400 });
    }
    else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
      await client.db(dbName).collection(collections.users).insertOne(userData);
      return NextResponse.json({ message: "Usuário registrado com sucesso" }, { status: 201 });
    }
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return null
  }
  finally {
    closeMongoDB();
  }
}

// Criar log
export async function createLogInDB(logData: any) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.logs)
    const result = await collection.insertOne(logData)
    return { ...logData, _id: result.insertedId.toString() }
  } catch (error) {
    console.error("Erro ao criar log:", error)
    return null
  }
  finally {
    closeMongoDB();
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
//       console.log(`Inicializado ${sampleData.clients.length} clientes de exemplo`)
//     }

//     const eventsCount = await db.collection(collections.events).countDocuments()
//     if (eventsCount === 0 && sampleData.events && sampleData.events.length > 0) {
//       await db.collection(collections.events).insertMany(sampleData.events)
//       console.log(`Inicializado ${sampleData.events.length} eventos de exemplo`)
//     }

//     const usersCount = await db.collection(collections.users).countDocuments()
//     if (usersCount === 0 && sampleData.users && sampleData.users.length > 0) {
//       await db.collection(collections.users).insertMany(sampleData.users)
//       console.log(`Inicializado ${sampleData.users.length} usuários de exemplo`)
//     }

//     return true
//   } catch (error) {
//     console.error("Erro ao inicializar dados de exemplo no MongoDB:", error)
//     return false
//   }
// }