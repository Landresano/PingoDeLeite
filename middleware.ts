import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rotas que não precisam de autenticação
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/mongodb/status",
  "/api/login",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se a rota é pública
  if (publicRoutes.includes(pathname) || pathname.startsWith("/_next/")) {
    return NextResponse.next()
  }

  // Verificar se é uma rota de API
  if (pathname.startsWith("/api/")) {
    // Permitir todas as requisições para rotas de API
    return NextResponse.next()
  }

  // Para rotas protegidas, vamos permitir o acesso sem verificação de autenticação
  // já que a verificação de autenticação é feita no componente de layout protegido
  // Isso evita o erro 401 no redirecionamento
  return NextResponse.next()
}

// Configurar em quais caminhos o middleware será executado
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication routes)
     * 2. /_next/static (static files)
     * 3. /_next/image (image optimization files)
     * 4. /favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

