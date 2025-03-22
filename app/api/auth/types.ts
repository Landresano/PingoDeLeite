// Tipos de autenticação - SEM a diretiva 'use server'
export interface AuthUser {
  id: string
  name: string
  email: string
  emailVerified?: boolean
}

export interface AuthToken {
  token: string
  expiresAt: string
}

export interface AuthResponse {
  user: AuthUser
  token: AuthToken
}

