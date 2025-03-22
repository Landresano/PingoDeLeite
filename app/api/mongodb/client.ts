import { MongoClient, ServerApiVersion } from "mongodb"
import { dbName, collections } from "./config"

// Connection URI
const uri = process.env.MONGODB_URI || ""

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
let client: MongoClient | null = null

// Export collections for use in other files
export { dbName, collections }

// Connect to MongoDB
export async function connectToMongoDB() {
  console.log("Attempting to connect to MongoDB with URI:", uri ? "URI exists" : "URI is empty")

  if (!uri || uri.trim() === "") {
    console.error("MongoDB URI is not defined or empty")
    throw new Error("MongoDB URI is not defined or empty")
  }

  try {
    if (!client) {
      console.log("Creating new MongoDB client")
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        connectTimeoutMS: 5000, // 5 seconds timeout
        socketTimeoutMS: 30000, // 30 seconds timeout
      })

      console.log("Connecting to MongoDB...")
      await client.connect()
      console.log("Connected to MongoDB successfully")
    } else {
      console.log("Using existing MongoDB client")
    }
    return client
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw error
  }
}

// Check database connection
export async function checkDatabaseConnection(): Promise<boolean> {
  console.log("Checking MongoDB connection...")

  if (!uri || uri.trim() === "") {
    console.error("MongoDB URI is not defined or empty")
    return false
  }

  try {
    const mongoClient = await connectToMongoDB()
    console.log("MongoDB client obtained, sending ping command...")
    await mongoClient.db(dbName).command({ ping: 1 })
    console.log("MongoDB connection check successful")
    return true
  } catch (error) {
    console.error("MongoDB connection check failed:", error)
    return false
  }
}

// Close MongoDB connection
export async function closeMongoDB(): Promise<void> {
  try {
    if (client) {
      console.log("Closing MongoDB connection...")
      await client.close()
      client = null
      console.log("MongoDB connection closed")
    } else {
      console.log("No MongoDB client to close")
    }
  } catch (error) {
    console.error("Error closing MongoDB connection:", error)
  }
}

