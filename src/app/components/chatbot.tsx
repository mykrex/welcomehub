'use client';

import { useState } from "react";

export default function Chatbot() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const sendPrompt = async () => {
    if (!prompt) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error: unknown) {
      setResponse("Error obteniendo respuesta: "+ String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      <button
        className="p-2 bg-blue-500 text-white rounded-full shadow-lg"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {open && (
        <div className="bg-white shadow-lg p-4 rounded-lg w-80 border mt-2">
          <h2 className="text-lg font-bold mb-2">Chatbot</h2>
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Escribe tu pregunta..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={sendPrompt}
            disabled={loading}
          >
            {loading ? "Generando..." : "Enviar"}
          </button>
          {response && <p className="mt-4 border p-2 rounded bg-gray-100">{response}</p>}
        </div>
      )}
    </div>
  );
}
