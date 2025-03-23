import { NextResponse } from "next/server";
import { fetchUserByEmailFromDB } from "@/app/api/mongodb/actions" // Import MongoDB actions
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log("Login attempt for:", email);

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find user in MongoDB
    const user = await fetchUserByEmailFromDB(email) as { _id: string; password?: string; [key: string]: any };

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


// import { NextResponse } from "next/server"
// import { authenticateUser } from "../actions"
// import { validateEmail } from "../utils"
// import { getFromLocalStorage } from "@/lib/local-storage"

// // Certifique-se de que a rota aceita apenas o método POST
// export async function POST(request: Request) {
//   console.log("Login route called with method:", request.method)

//   try {
//     const { email, password } = await request.json()
//     console.log("Login attempt for email:", email)

//     if (!email || !password) {
//       return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
//     }

//     // Validar email
//     try {
//       const isEmailValid = await validateEmail(email)
//       if (!isEmailValid && email !== "teste") {
//         // Exceção para o usuário de teste
//         return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
//       }
//     } catch (validationError) {
//       console.error("Email validation error:", validationError)
//       // Continue mesmo com erro de validação
//     }

//     try {
//       // Tentar autenticar com MongoDB
//       const result = await authenticateUser(email, password)

//       if (result.success) {
//         console.log("MongoDB authentication successful")
//         return NextResponse.json(result)
//       }
//     } catch (mongoError) {
//       console.error("MongoDB authentication failed, falling back to localStorage:", mongoError)
//       // Continuar para o fallback do localStorage
//     }

//     // Fallback para localStorage
//     try {
//       console.log("Trying localStorage authentication")
//       const users = getFromLocalStorage("users") || []
//       const user = users.find((u: any) => u.email === email && u.password === password)

//       if (user) {
//         console.log("localStorage authentication successful")
//         // Remover senha antes de retornar
//         const { password: _, ...safeUser } = user

//         return NextResponse.json({
//           success: true,
//           user: safeUser,
//           token: `token-${user.id}`,
//           source: "localStorage",
//         })
//       }

//       return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
//     } catch (localError) {
//       console.error("Error during localStorage authentication:", localError)
//       return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
//     }
//   } catch (error) {
//     console.error("Error during login:", error)
//     return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
//   }
// }

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

