"use client";

import { useState, useEffect } from "react";
import { useChat } from "@/app/context/ChatContext";
import { Send } from "lucide-react";
import { Input } from "@/app/components/Input";
import { Button } from "@/app/components/Button";
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

  // Saludo inicial
  useEffect(() => {
    if (open && messages.length === 0 && !loading) {
      sendPrompt("");
    }
  }, [open, messages, loading, sendPrompt]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full bg-[#042C45] p-3 shadow-lg hover:bg-[#064C75] transition-colors"
      >
        <CompiIcon className="w-10 h-10 text-white" />
      </button>

      {open && (
        <div className="mt-2 w-80 max-h-[500px] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#448AFF]/40 bg-[#042C45] text-white">
          {/* Header del chatbot */}
          <div className="p-4 border-b border-[#448AFF]/20 flex items-center gap-3">
            <div className="w-8 h-8">
              <CompiIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-semibold text-base">Compi</h2>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl text-sm max-w-[75%] ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-sm text-gray-400 italic">Compi está escribiendo...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#448AFF]/20 p-2 bg-[#021d30]">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendPrompt(prompt);
                }
              }}
              placeholder="Escribe tu mensaje..."
              className="text-sm text-white bg-[#042C45] border border-[#448AFF]/40"
            />
            <Button
              onClick={() => sendPrompt(prompt)}
              className="mt-2 w-full text-sm"
              disabled={loading}
            >
              {loading ? "Generando..." : (
                <div className="flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Enviar
                </div>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
