// src/app/chatgpt.ts
export async function getChatbotResponse(message: string): Promise<string> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Error en el servidor");

    return data.response;
  } catch (err: unknown) {
    if(err instanceof Error){
      console.error("Error en ChatGPT API:", err.message);
    } else {
      console.error("Error en ChatGPT API:", String(err));
    }
    return "Hubo un error al procesar tu solicitud.";
  }
}
