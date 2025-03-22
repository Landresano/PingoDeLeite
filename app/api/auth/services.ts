// Remova a diretiva 'use server' se estiver presente
// Este arquivo deve conter apenas serviços, não ações do servidor

import { fetchUserByEmailFromDB, createUserInDB, updateClientInDB } from "../mongodb/actions"

// Serviços para autenticação
export const authServices = {
  async findUserByEmail(email: string) {
    return await fetchUserByEmailFromDB(email)
  },

  async createUser(userData: any) {
    return await createUserInDB(userData)
  },

  async updateUser(id: string, userData: any) {
    return await updateClientInDB(id, userData)
  },
}

