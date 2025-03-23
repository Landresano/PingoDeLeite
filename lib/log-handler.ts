// Função para registrar ações e fornecer feedback
export async function logAction(action: string, toast: any, success = true, details?: any): Promise<void> {
  const timestamp = new Date().toISOString()

  // Obter usuário atual
  let userId = "desconhecido"
  let userName = "desconhecido"

  try {
    const userJson = localStorage.getItem("current_user")
    if (userJson) {
      const user = JSON.parse(userJson)
      userId = user.id
      userName = user.name
    }
  } catch (error) {
    console.error("Erro ao obter usuário atual para registro:", error)
  }

  const logEntry = {
    id: Date.now().toString(),
    action,
    timestamp,
    success,
    userId,
    userName,
    details,
  }

  console.log("Registro de ação:", logEntry)

  // // Armazenar no localStorage primeiro
  // try {
  //   const logs = JSON.parse(localStorage.getItem("action_logs") || "[]")
  //   logs.unshift(logEntry)
  //   localStorage.setItem("action_logs", JSON.stringify(logs.slice(0, 100))) // Manter os últimos 100 registros
  // } catch (localError) {
  //   console.error("Falha ao salvar registro de ação no localStorage:", localError)
  // }

  // Tentar armazenar no MongoDB via API
  try {
    const response = await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logEntry),
      cache: "no-store", // Evitar cache
    })

    if (!response.ok) {
      console.error("Falha ao salvar registro de ação na API:", response.status)
    }
  } catch (apiError) {
    console.error("Falha ao salvar registro de ação na API:", apiError)
  }

  // Mostrar notificação de feedback
  if (toast) {
    try {
      if (success) {
        toast({
          title: "Sucesso",
          description: `${action} concluída com sucesso`,
        })
      } else {
        toast({
          title: "Ação Falhou",
          description: `Falha ao ${action.toLowerCase()}. ${details?.error || ""}`,
          variant: "destructive",
        })
      }
    } catch (toastError) {
      console.error("Erro ao exibir notificação:", toastError)
    }
  }
}
