import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "../client"
import { Status } from "@/lib/types"

export async function GET() {
  try {
    // Adicionar um timeout para a verificação do banco de dados
    const timeoutPromise = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        console.log("Tempo limite para verificação do banco de dados atingido")
        resolve(false)
      }, 3000)
    })

    const connectionPromise = checkDatabaseConnection().catch((error) => {
      console.error("Erro em checkDatabaseConnection:", error)
      return false
    })

    const isConnected = await Promise.race([connectionPromise, timeoutPromise])



    return NextResponse.json({
      status: isConnected ? Status.CONNECTED : Status.DISCONNECTED,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao verificar o status do MongoDB:", error)
    return NextResponse.json(
      {
        status: Status.ERROR,
        message: "Falha ao verificar a conexão com o MongoDB",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
