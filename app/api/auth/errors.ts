// Remova a diretiva 'use server' se estiver presente
// Este arquivo deve conter apenas erros, não ações do servidor

// Erros para autenticação
export const authErrors = {
  invalidCredentials: "Invalid email or password",
  userNotFound: "User not found",
  emailAlreadyExists: "Email already exists",
  invalidToken: "Invalid token",
  tokenExpired: "Token expired",
  unauthorized: "Unauthorized",
  forbidden: "Forbidden",
}

