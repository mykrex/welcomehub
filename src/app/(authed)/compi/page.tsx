'use client';

import { useChat } from "@/app/context/ChatContext";

export default function ChatPage() {
  const { messages, prompt, setPrompt, sendPrompt, loading, messagesEndRef } = useChat();

  return (
    <div className="flex flex-col h-full w-full rounded-[15px] bg-[#042C45] overflow-hidden text-white">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 shadow text-white">
          <h2 className="text-lg font-bold">Compi</h2>
        </div>

        {/* Messages */}
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
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-700 p-4 bg-[#042C45]">
          <textarea
            className="w-full border border-gray-300 p-2 rounded text-sm resize-none text-white"
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
