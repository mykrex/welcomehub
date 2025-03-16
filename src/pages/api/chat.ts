import type { NextApiRequest, NextApiResponse } from "next";
import { getChatbotResponse } from "../../app/huggingface";
import { AxiosError } from "axios";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Falta el prompt" });
  }

  try {
    const response = await getChatbotResponse(prompt);
    res.status(200).json({ response });
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("Error de Axios:", error.response?.data || error.message);
      return res.status(500).json({ error: "Error en la API de Hugging Face", details: error.response?.data || error.message });
    }
    console.error("Error desconocido:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
