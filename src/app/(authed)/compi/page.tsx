'use client';

import { useUser } from "@/app/context/UserContext";
import { supabase } from "@/lib/supabase";
import { useState, useRef, useEffect } from "react";

type Message = { sender: "user" | "bot"; text: string };

export default function Compi() {
  const { user } = useUser();
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  //const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    console.log("Usuario desde el contexto:", user);
  }, [user]);


  useEffect(() => {
    const fetchUserId = async () => {

      if (!user?.email) return;
      

      const { data, error } = await supabase
        .from("usuario")
        .select("id_usuario")
        .eq("email", user.email)
        .single();

      if (error || !data) {
        console.error("Error al obtener el ID del usuario", error?.message);
        return;
      }
      if (data){
        setUserId(data.id_usuario);
        console.log("ID de usuario:", data.id_usuario);
      }
      
    
      
    };
    fetchUserId();
  }, [user?.email]);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    console.log("userId:", userId, "user:", user);
    if (!userId) {
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
       body: JSON.stringify({ prompt, id_usuario: userId }),
      });

      const data = await res.json();
      const botMessage: Message = { sender: "bot", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error al obtener la respuesta", error);
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
          <div className="border-t border-gray-700 p-4">
            <textarea
              className="w-full border border-gray-300 p-2 rounded text-sm resize-none"
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
