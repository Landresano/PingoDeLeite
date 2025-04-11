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
    if (typeof localStorage !== "undefined") { // Verificar se localStorage está disponível
      const userJson = localStorage.getItem("current_user");
      if (userJson) {
        const user = JSON.parse(userJson);
        userId = user.id;
        userName = user.name;
      }
    } else {
      console.warn("localStorage não está disponível neste contexto.");
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
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", // Ensure the server knows the client expects JSON
      },
      body: JSON.stringify(logEntry),
      cache: "no-store", // Evitar cache
    });

    if (!response.ok) {
      const errorText = await response.text(); // Capture server response for debugging
      console.error(
        `Falha ao salvar registro de ação na API: ${response.status} - ${response.statusText}`,
        errorText
      );
      throw new Error(`API responded with status ${response.status}`);
    }
  } catch (apiError) {
    if (apiError instanceof Error) {
      console.error("Erro ao salvar registro de ação na API:", apiError.message);
    } else {
      console.error("Erro ao salvar registro de ação na API:", apiError);
    }
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