'use client';

import { useEffect } from "react";
import { getChatbotResponse } from "../huggingface";

export default function Home() {
  useEffect(() => {
    async function testAPI() {
      const response = await getChatbotResponse("¿Cuál es la capital de Francia?");
      console.log("Respuesta del chatbot:", response);
    }
    testAPI();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <h1 className="text-xl font-bold">Prueba de Chatbot</h1>
    </div>
  );
}
