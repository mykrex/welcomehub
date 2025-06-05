"use client";

import { useChat } from "@/app/context/ChatContext";
import { useEffect } from "react";
import { Bot, Send } from "lucide-react";
import { Input } from "@/app/components/Input";
import { Button } from "@/app/components/Button";
import { Avatar } from "@/app/components/Avatar";
import React from "react";
import Link from "next/link";

export default function ChatPage() {
  const {
    messages,
    prompt,
    setPrompt,
    sendPrompt,
    loading,
    messagesEndRef
  } = useChat();

  // Auto‐scroll al final cuando llegan nuevos mensajes
  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  return (
    <div className="min-h-screen bg-[#042C45] text-white">
      {/* Header */}
      <div className="bg-[#042C45] border-b border-[#448AFF]/20 sticky top-0 z-10 px-6 py-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <div className="w-12 h-12 bg-[#448AFF] rounded-[15px] flex items-center justify-center shadow-lg">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#448AFF]">Compi</h2>
            <p className="text-sm text-[#06D6A0]">En línea • Listo para ayudarte</p>
          </div>
        </div>
      </div>

      {/* Chat Body */}
      <div className="max-w-4xl mx-auto px-6 py-6 h-[calc(100vh-160px)] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-4 ${
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar sender={message.sender} className="w-10 h-10" />
              <div
                className={`flex-1 max-w-[80%] ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-4 rounded-[15px] shadow-lg ${
                    message.sender === "user"
                      ? "bg-[#06D6A0] text-white"
                      : "bg-[#448AFF]/10 border border-[#448AFF]/20 text-gray-100"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {message.text}
                  </p>
                </div>

                {/* Aquí renderizamos los botones si el mensaje tiene acciones */}
                {message.actions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.actions.map((action, i) => (
                      <Link
                        key={i}
                        href={action.href}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      >
                        {action.label}
                      </Link>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-2">
                  {message.sender === "user" ? "Tú" : "Compi"} • ahora
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4">
              <Avatar sender="bot" className="w-10 h-10" />
              <div className="flex-1">
                <div className="inline-block p-4 rounded-[15px] bg-[#448AFF]/10 border border-[#448AFF]/20 shadow-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#448AFF] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#448AFF] rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-[#448AFF] rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Compi está escribiendo...
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="mt-6 border-t border-[#448AFF]/20 pt-4">
          <div className="flex gap-4">
            <Input
              className="flex-1 py-4 px-4 bg-[#448AFF]/5 border border-[#448AFF]/30 focus:border-[#448AFF] focus:ring-[#448AFF] rounded-[15px] text-white placeholder-gray-400"
              placeholder="Escribe tu mensaje aquí..."
              value={prompt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPrompt(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendPrompt(prompt);
                }
              }}
              disabled={loading}
            />
            <Button
              onClick={() => sendPrompt(prompt)}
              disabled={loading || !prompt.trim()}
              className="px-6 py-4 bg-[#448AFF] hover:bg-[#448AFF]/80 text-white rounded-[15px] shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Presiona Enter para enviar • Compi puede cometer errores
          </p>
        </div>
      </div>
    </div>
  );
}
