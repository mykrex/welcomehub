'use client';

import { useChat } from "@/app/context/ChatContext";

export default function ChatPage() {
  const { messages, prompt, setPrompt, sendPrompt, loading, messagesEndRef } = useChat();

  return (
    <div className="flex flex-col h-full w-full bg-[#042C45] text-white relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 shadow">
        <h2 className="text-lg font-bold">Compi</h2>
      </div>

      {/* Contenedor scrollable de mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 mb-[140px]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-3 py-2 rounded-lg text-sm max-w-[75%] ${
                message.sender === "user" ? "bg-blue-600 text-white" : "bg-white text-black"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input fijo abajo (usamos absolute para que no se mueva con el scroll) */}
      <div className="absolute bottom-0 left-0 w-full bg-[#042C45] border-t border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <textarea
            className="w-full border border-gray-300 p-2 rounded text-sm resize-none text-white bg-transparent"
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
            className="mt-2 w-full bg-blue-600 text-white py-2 rounded text-sm"
            onClick={sendPrompt}
            disabled={loading}
          >
            {loading ? "Generando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
