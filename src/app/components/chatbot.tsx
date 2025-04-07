'use client';

//import { Message } from "openai/resources/beta/threads/messages.mjs";
import { supabase } from "@/lib/supabase";
import { useState, useRef, useEffect } from "react";


type Message = { sender: "user" | "bot"; text: string };

export default function Chatbot() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  //const [messages, setMessages] = useState<{sender: "user" | "bot"; text: string}[]>([]);
  //const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
    };
    fetchUser();
  }, []);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;
    if (!userEmail) {
      alert("Por favor, inicia sesión para enviar un mensaje.");
      return;
    }

    const userMessage: Message = { sender: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ prompt, id_usuario: userEmail }),
      });

      const data = await res.json();
      const botMessage: Message = { sender: "bot", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = { sender: "bot", text: "Error al obtener la respuesta" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      <button
        className="p-2 bg-blue-500 text-white rounded-full shadow-lg"
        onClick={() => setOpen(!open)}
      >
        💬
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
                  className={`px-3 py-2 rounded-lg text-sm max-w[75%] ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
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
              onClick={sendPrompt}
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
