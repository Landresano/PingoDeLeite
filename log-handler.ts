export async function logAction(action: string, details: any) {
  try {
    const response = await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, details }),
    });

    if (!response.ok) {
      console.error(`Falha ao salvar registro de ação na API: ${response.status}`);
    }
  } catch (error) {
    console.error("Erro ao enviar log para a API:", error);
  }
}
