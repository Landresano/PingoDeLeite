import { NextResponse } from "next/server";
import { fetchUserByEmailFromDB } from "@/app/api/mongodb/actions" // Import MongoDB actions
import User from "@/lib/types"
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log("Login attempt for:", email);

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find user in MongoDB
    const user = await fetchUserByEmailFromDB(email);

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Check password (hashed)
    const isPasswordValid = user.password ? await bcrypt.compare(password, user.password) : false;
        if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    console.log("Login successful");

    // Remove password before returning response
    const { password: _, ...safeUser } = user || {};

    return NextResponse.json({
      success: true,
      user: safeUser,
      token: `token-${user._id}`, // Replace with JWT if needed
      source: "MongoDB",
    }, { status: 200 });

  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

// Adicionar um handler para OPTIONS para lidar com preflight CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

