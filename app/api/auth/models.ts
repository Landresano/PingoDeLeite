// Remova a diretiva 'use server' se estiver presente
// Este arquivo deve conter apenas modelos, não ações do servidor

// Modelos para autenticação
export interface User {
  id: string
  name: string
  email: string
  password: string
  emailVerified?: boolean
  createdAt: string
  updatedAt?: string
}

export interface Session {
  id: string
  userId: string
  expires: string
  token: string
}

