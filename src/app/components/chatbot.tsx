"use client";

import { useState, useEffect } from "react";
import { useChat } from "@/app/context/ChatContext";
import CompiIcon from "./CompiIcon";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const {
    messages,
    prompt,
    setPrompt,
    sendPrompt,
    loading,
    messagesEndRef,
  } = useChat();

  // Log para ver qué mensajes hay
  useEffect(() => {
    console.log("Mensajes cargados en Chatbot.tsx:", messages);
  }, [messages]);

  // Forzar saludo inicial si no hay historial
  useEffect(() => {
    if (open && messages.length === 0 && !loading) {
      console.log("Forzando mensaje de bienvenida desde el frontend...");
      sendPrompt(""); // forzar saludo
    }
  }, [open, messages, loading, sendPrompt]);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      <button
        className="p-2 rounded-full shadow-lg"
        onClick={() => setOpen(!open)}
      >
        <CompiIcon className="w-12 h-12" />
      </button>

      {open && (
        <div className="bg-white shadow-lg rounded-lg w-80 border mt-2 flex flex-col max-h-[500px]">
          <h2 className="text-lg font-bold p-4 border-b">Compi</h2>
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg text-sm max-w-[75%] ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-sm text-gray-500 px-3 italic">Compi está escribiendo...</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t p-2">
            <textarea
              className="w-full border p-2 rounded text-sm resize-none"
              rows={2}
              placeholder="Hola, ¿cómo puedo ayudarte?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendPrompt();
                }
              }}
            />
            <button
              className="mt-2 w-full bg-blue-500 text-white py-2 rounded text-sm"
              onClick={() => sendPrompt()}
              disabled={loading}
            >
              {loading ? "Generando..." : "Enviar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
