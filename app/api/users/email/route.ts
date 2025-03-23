import { NextResponse } from "next/server"
import { fetchUserByEmailFromDB } from "../../mongodb/actions"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
    }

    const user = await fetchUserByEmailFromDB(email)

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Remove password before sending response
    const { password, ...safeUser } = user

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error("Erro ao buscar usuário pelo email:", error)
    return NextResponse.json({ error: "Falha ao buscar usuário" }, { status: 500 })
  }
}
