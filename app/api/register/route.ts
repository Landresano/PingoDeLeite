import { NextResponse } from "next/server";
import { createUserInDB } from "../mongodb/actions"

export async function POST(request: Request) {
  try {
       const dadosUsuario = await request.json()
       const novoUsuario = await createUserInDB(dadosUsuario)
         if (!novoUsuario) {
            return NextResponse.json({ error: "Falha ao criar usuário" }, { status: 500 })
         }   
         return NextResponse.json(novoUsuario, { status: 201 })
  } catch (error) {                                                                 
    console.error("Erro ao criar usuário:", error)
    return NextResponse.json({ error: "Falha ao criar usuário" }, { status: 500 })
  }      
}