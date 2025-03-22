import { NextResponse } from "next/server"

// Remova este arquivo se não estiver usando NextAuth.js
export async function GET(request: Request) {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 })
}

export async function POST(request: Request) {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 })
}

