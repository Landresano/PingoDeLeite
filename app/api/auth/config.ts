// Configurações de autenticação - SEM a diretiva 'use server'
export const authConfig = {
  tokenExpiresIn: "7d",
  cookieName: "auth_token",
  cookieMaxAge: 60 * 60 * 24 * 7, // 7 days
}

