import { NextResponse } from "next/server"
import { fetchUsersFromDB, createUserInDB, fetchUserByEmailFromDB } from "../mongodb/actions"

export async function GET() {
  try {
    const users = await fetchUsersFromDB()

    // Remove senhas antes de enviar para o cliente
    const safeUsers = users.map((user) => {
      const { password, ...safeUser } = user
      return safeUser
    })

    return NextResponse.json(safeUsers)
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return NextResponse.json({ error: "Falha ao buscar usuários" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userData = await request.json()

    // Verificar se já existe um usuário com este email
    const existingUser = await fetchUserByEmailFromDB(userData.email)
    if (existingUser) {
      return NextResponse.json({ error: "Usuário com este email já existe" }, { status: 409 })
    }

    const newUser = await createUserInDB(userData) as { password: string; [key: string]: any } | null

    if (!newUser || typeof newUser !== "object" || typeof newUser.password !== "string") {
      return NextResponse.json({ error: "Falha ao criar usuário" }, { status: 500 })
    }

    // Remover senha antes de enviar a resposta
    const { password, ...safeUser } = newUser

    return NextResponse.json(safeUser, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return NextResponse.json({ error: "Falha ao criar usuário" }, { status: 500 })
  }
}
