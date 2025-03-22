// Remova a diretiva 'use server' se estiver presente
// Este arquivo deve conter apenas helpers, não ações do servidor

// Helpers para autenticação
export const authHelpers = {
  generateToken: () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  },

  hashPassword: (password: string) => {
    // Em uma aplicação real, você usaria bcrypt ou similar
    return password
  },

  comparePassword: (password: string, hashedPassword: string) => {
    // Em uma aplicação real, você usaria bcrypt ou similar
    return password === hashedPassword
  },
}

