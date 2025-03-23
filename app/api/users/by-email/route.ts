import { NextResponse } from "next/server"
import { fetchUserByEmailFromDB } from "../../mongodb/actions"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "O parâmetro de email é obrigatório" }, { status: 400 })
  }

  try {
    const user = await fetchUserByEmailFromDB(email)

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Remove a senha antes de enviar a resposta
    const { password, ...safeUser } = user

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error(`Erro ao buscar usuário pelo email ${email}:`, error)
    return NextResponse.json({ error: "Falha ao buscar usuário" }, { status: 500 })
  }
}
