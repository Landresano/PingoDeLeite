// Função para registrar ações e fornecer feedback
export async function logAction(
  action: string,
  showToast: (options: { title: string; description: string; variant?: string }) => void,
  success = true,
  details?: any
): Promise<void> {
  const timestamp = new Date().toISOString();
  let userId = "desconhecido";
  let userName = "desconhecido";

  // Obter usuário atual com try-catch mais específico
  if (typeof window !== 'undefined') {
    try {
      const userJson = localStorage.getItem("current_user");
      if (userJson) {
        const user = JSON.parse(userJson);
        userId = user.id;
        userName = user.name;
      }
    } catch (error) {
      console.warn("Erro ao acessar localStorage:", error);
    }
  }

  const logEntry = {
    id: Date.now().toString(),
    action,
    timestamp,
    success,
    userId,
    userName,
    details,
  };

  // Salvar no MongoDB via API
  try {
    const response = await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logEntry),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Falha ao salvar registro de ação na API:", error);
    // Não mostrar toast de erro para falhas de log para não afetar a experiência do usuário
  }

  // Mostrar notificação apenas para a ação principal
  showToast({
    title: success ? "Sucesso" : "Ação Falhou",
    description: success ? `${action} concluída com sucesso` : `Falha ao ${action.toLowerCase()}. ${details?.error || ""}`,
    variant: success ? undefined : "destructive",
  });
}