// Remova a diretiva 'use server' se estiver presente
// Este arquivo deve conter apenas validadores, não ações do servidor

// Validadores para autenticação
export const validators = {
  email: (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  },

  password: (password: string) => {
    return password.length >= 6
  },

  name: (name: string) => {
    return name.length >= 2
  },
}

