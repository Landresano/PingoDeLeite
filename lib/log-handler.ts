// Função para registrar ações e fornecer feedback
export async function logAction(
  action: string,
  showToast: (options: { title: string; description: string; variant?: string }) => void,
  success = true,
  details?: any
): Promise<void> {
  const timestamp = new Date().toISOString();

  // Obter usuário atual
  let userId = "desconhecido";
  let userName = "desconhecido";

  try {
    const userJson = localStorage.getItem("current_user");
    if (userJson) {
      const user = JSON.parse(userJson);
      userId = user.id;
      userName = user.name;
    }
  } catch (error) {
    console.error("Erro ao obter usuário atual para registro:", error);
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

  console.log("Registro de ação:", logEntry);

  // Salvar no MongoDB via API
  try {
    const response = await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logEntry),
      cache: "no-store", // Evitar cache
    });

    if (!response.ok) {
      console.error("Falha ao salvar registro de ação na API:", response.status);
    }
  } catch (apiError) {
    console.error("Falha ao salvar registro de ação na API:", apiError);
  }

  // Mostrar notificação de feedback usando a função showToast
  try {
    showToast({
      title: success ? "Sucesso" : "Ação Falhou",
      description: success ? `${action} concluída com sucesso` : `Falha ao ${action.toLowerCase()}. ${details?.error || ""}`,
      variant: success ? undefined : "destructive",
    });
  } catch (toastError) {
    console.error("Erro ao exibir notificação:", toastError);
  }
}