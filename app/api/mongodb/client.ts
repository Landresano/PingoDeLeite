import { MongoClient, ServerApiVersion } from "mongodb"
import { dbName, collections } from "./config"

// Connection URI
const uri = process.env.MONGODB_URI || ""

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
let client: MongoClient | null = null

// Export collections for use in other files
export { dbName, collections }

// Connect to MongoDB
// This function establishes a connection to the MongoDB database using the provided URI.
// If a connection already exists, it reuses the existing client.
export async function connectToMongoDB() {
  console.log("Tentando conectar ao MongoDB com URI:", uri ? "URI existe" : "URI está vazia");

  if (!uri || uri.trim() === "") {
    console.error("URI do MongoDB não está definida ou está vazia");
    throw new Error("URI do MongoDB não está definida ou está vazia");
  }

  try {
    if (!client) {
      console.log("Criando um novo cliente MongoDB");
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        connectTimeoutMS: 5000, // 5 segundos de timeout
        socketTimeoutMS: 30000, // 30 segundos de timeout
      });

      console.log("Conectando ao MongoDB...");
      await client.connect();
      console.log("Conectado ao MongoDB com sucesso");
    } else {
      console.log("Usando cliente MongoDB existente");
    }
    return client;
  } catch (error) {
    console.error("Falha ao conectar ao MongoDB:", error);
    throw error;
  }
}

// Check database connection
// This function verifies the connection to the MongoDB database by sending a ping command.
export async function checkDatabaseConnection(): Promise<boolean> {
  console.log("Verificando conexão com o MongoDB...");

  if (!uri || uri.trim() === "") {
    console.error("URI do MongoDB não está definida ou está vazia");
    return false;
  }

  try {
    const mongoClient = await connectToMongoDB();
    console.log("Cliente MongoDB obtido, enviando comando ping...");
    await mongoClient.db(dbName).command({ ping: 1 });
    console.log("Verificação de conexão com o MongoDB bem-sucedida");
    return true;
  } catch (error) {
    console.error("Falha na verificação de conexão com o MongoDB:", error);
    return false;
  }
}

// Close MongoDB connection
// This function closes the MongoDB connection if it is open.
export async function closeMongoDB(): Promise<void> {
  try {
    if (client) {
      console.log("Fechando conexão com o MongoDB...");
      await client.close();
      client = null;
      console.log("Conexão com o MongoDB fechada");
    } else {
      console.log("Nenhum cliente MongoDB para fechar");
    }
  } catch (error) {
    console.error("Erro ao fechar conexão com o MongoDB:", error);
  }
}
