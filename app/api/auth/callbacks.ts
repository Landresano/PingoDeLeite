// Remova a diretiva 'use server' se estiver presente
// Este arquivo deve conter apenas callbacks, não ações do servidor

// Callbacks para autenticação
export const callbacks = {
  async jwt({ token, user }: any) {
    if (user) {
      token.id = user.id
    }
    return token
  },
  async session({ session, token }: any) {
    if (token) {
      session.user.id = token.id
    }
    return session
  },
}

