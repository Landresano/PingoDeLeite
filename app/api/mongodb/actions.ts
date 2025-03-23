"use server"

import { NextResponse } from "next/server";
import { connectToMongoDB } from "./client"
import { dbName, collections } from "./config"
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { handleError } from "@/lib/error-handler";

// Buscar todos os clientes
export async function fetchClientsFromDB() {
  try {
    const client = await connectToMongoDB();
    const collection = client.db(dbName).collection(collections.clients);
    return await collection.find({}).toArray();
  } catch (error) {
    console.error("Erro ao buscar clientes:", error)
    return []
  }
}

// Buscar cliente por ID
export async function fetchClientFromDB(id: string) {
  try {
    const client = await connectToMongoDB();
    const collection = client.db(dbName).collection(collections.clients);
    const foundClient = await collection.findOne({ _id: new ObjectId(id) });
    return foundClient ? { ...foundClient, _id: foundClient._id.toString() } : null;
  } catch (error) {
    console.error("Erro ao buscar cliente por ID:", error);
    return null;
  }
}

// Criar cliente
export async function createClientInDB(clientData: any) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.clients)
    const result = await collection.insertOne(clientData)
    return { ...clientData, _id: result.insertedId.toString() }
  } catch (error) {
    console.error("Erro ao criar cliente:", error)
    return null
  }
}

// Atualizar cliente
export async function updateClientInDB(id: string, clientData: any) {
  try {
    const client = await connectToMongoDB();
    const collection = client.db(dbName).collection(collections.clients);

    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: clientData });
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return false;
  }
}

// Deletar cliente
export async function deleteClientFromDB(id: string) {
  try {
    const client = await connectToMongoDB();
    const collection = client.db(dbName).collection(collections.clients);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    return false;
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
    const foundEvent = await collection.findOne({ _id: new ObjectId(id) });
    return foundEvent ? { ...foundEvent, _id: foundEvent._id.toString() } : null;
  } catch (error) {
    console.error("Erro ao buscar evento:", error)
    return null
  }
}

// Buscar eventos por ID do cliente
export async function fetchEventsByClientFromDB(clientId: string) {
  try {
    const client = await connectToMongoDB();
    const collection = client.db(dbName).collection(collections.events);
    const events = await collection.find({ clienteId: clientId }).toArray();
    return events;
  } catch (error) {
    console.error("Erro ao buscar eventos por cliente:", error);
    return [];
  }
}

// Criar evento
export async function createEventInDB(eventData: any) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    const result = await collection.insertOne(eventData)
    return { ...eventData, _id: result.insertedId.toString() }
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
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: eventData });
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return false;
  }
}

// Deletar evento
export async function deleteEventFromDB(id: string) {
  try {
    const client = await connectToMongoDB()
    const collection = client.db(dbName).collection(collections.events)
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    return false;
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
    const foundUser = await collection.findOne({ email })
    return foundUser ? { ...foundUser, _id: foundUser._id.toString() } : null;
  } catch (error) {
    console.error("Erro ao buscar usuário por email:", error)
    return null
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
      const result = await client.db(dbName).collection(collections.users).insertOne(userData);
      return NextResponse.json({ message: "Usuário registrado com sucesso" }, { status: 201 });
    }
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
    return { ...logData, _id: result.insertedId.toString() }
  } catch (error) {
    console.error("Erro ao criar log:", error)
    return null
  }
}

// Inicializar banco de dados com dados de exemplo
export async function initializeSampleDataInDB(sampleData: any) {
  try {
    const client = await connectToMongoDB()
    const db = client.db(dbName)

    // Verificar se as coleções estão vazias
    const clientsCount = await db.collection(collections.clients).countDocuments()
    if (clientsCount === 0 && sampleData.clients && sampleData.clients.length > 0) {
      await db.collection(collections.clients).insertMany(sampleData.clients)
      console.log(`Inicializado ${sampleData.clients.length} clientes de exemplo`)
    }

    const eventsCount = await db.collection(collections.events).countDocuments()
    if (eventsCount === 0 && sampleData.events && sampleData.events.length > 0) {
      await db.collection(collections.events).insertMany(sampleData.events)
      console.log(`Inicializado ${sampleData.events.length} eventos de exemplo`)
    }

    const usersCount = await db.collection(collections.users).countDocuments()
    if (usersCount === 0 && sampleData.users && sampleData.users.length > 0) {
      await db.collection(collections.users).insertMany(sampleData.users)
      console.log(`Inicializado ${sampleData.users.length} usuários de exemplo`)
    }

    return true
  } catch (error) {
    console.error("Erro ao inicializar dados de exemplo no MongoDB:", error)
    return false
  }
}