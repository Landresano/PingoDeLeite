// Função para lidar com erros de forma consistente em toda a aplicação
export function handleError(error: any, toast: any, customMessage?: string): string {
  console.error("Ocorreu um erro:", error)

  // Extrair mensagem de erro
  let errorMessage = "Ocorreu um erro desconhecido"

  if (typeof error === "string") {
    errorMessage = error
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else if (error && typeof error === "object" && "message" in error) {
    errorMessage = String(error.message)
  }

  // Usar mensagem personalizada, se fornecida
  const displayMessage = customMessage || errorMessage

  // Mostrar notificação (toast)
  if (toast) {
    try {
      toast({
        title: "Erro",
        description: displayMessage,
        variant: "destructive",
      })
    } catch (toastError) {
      console.error("Erro ao exibir notificação:", toastError)
    }
  }

  return displayMessage
}