"use server"

import { NextResponse } from "next/server";
import { connectToMongoDB } from "./client"
import { dbName, collections } from "./config"
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { Handlee } from "next/font/google";
import { handleError } from "@/lib/error-handler";

// Fetch all clients
export async function fetchClientsFromDB() {
  try {
    const client = await connectToMongoDB();
    const collection = client.db(dbName).collection(collections.clients);
    return await collection.find({}).toArray();
  } catch (error) {
    console.error("Error fetching clients:", error)
    return []
  }
}

// Fetch client by ID
export async function fetchClientFromDB(id: string) {
  try {
    const client = await connectToMongoDB();
    const collection = client.db(dbName).collection(collections.clients);
    const foundClient = await collection.findOne({ _id: new ObjectId(id) });
    return foundClient ? { ...foundClient, _id: foundClient._id.toString() } : null;
  } catch (error) {
    console.error("Error fetching client by ID:", error);
    return null;
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
    const client = await connectToMongoDB();
    const collection = client.db(dbName).collection(collections.clients);

    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: clientData });
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error updating client:", error);
    return false;
  }
}

// Delete client
export async function deleteClientFromDB(id: string) {
  try {
    const client = await connectToMongoDB();
    const collection = client.db(dbName).collection(collections.clients);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting client:", error);
    return false;
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
    const client = await connectToMongoDB();
    const collection = client.db(dbName).collection(collections.events);

    return await collection.find({ clienteId: clientId }).toArray();
  } catch (error) {
    console.error("Error fetching events by client ID:", error);
    return [];
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
// export async function createUserInDB(userData: any) {
//   try {
//     const client = await connectToMongoDB()
//     const collection = client.db(dbName).collection(collections.users)
//     const result = await collection.insertOne(userData)
//     return { ...userData, _id: result.insertedId }
//   } catch (error) {
//     console.error("Error creating user:", error)
//     return null
//   }
// }
export async function createUserInDB(userData: any) {
  try {
    const client = await connectToMongoDB()
    const existingUser = await client.db(dbName).collection(collections.users).findOne({ email: userData.email });

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }
    else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
      const result = await client.db(dbName).collection(collections.users).insertOne(userData);
      return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    }
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

