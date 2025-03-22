import { NextResponse } from "next/server";
import { createUserInDB } from "../mongodb/actions"

export async function POST(request: Request) {
  try {
       const userData = await request.json()
       const newUser = await createUserInDB(userData)
         if (!newUser) {
            return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
         }   
         return NextResponse.json(newUser, { status: 201 })
  } catch (error) {                                                                 
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }      
}