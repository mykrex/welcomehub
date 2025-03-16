const HF_API_URL = "http://127.0.0.1:5000/api/chat"; // Servidor local de Flask

export async function getChatbotResponse(message: string): Promise<string> {
  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: message }),
    });

    if (!response.ok) {
      throw new Error(`Error en la API local: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.response) {
      throw new Error("La API no devolvió una respuesta válida.");
    }

    return data.response;
  } catch (error: any) {
    console.error("Error en la API local:", error.message || error);
    return "Hubo un error al procesar tu solicitud.";
  }
}
