"use client";

import { useUser } from "../context/UserContext";
import { supabase } from "@/lib/supabase";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

type Message = { sender: "user" | "bot"; text: string };

interface ChatContextProps {
  messages: Message[];
  prompt: string;
  loading: boolean;
  setPrompt: (prompt: string) => void;
  sendPrompt: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  //const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return;

      //debugging
      //console.log("Email recibido en ChatContext:", user.email);

      const { data, error } = await supabase
        .from("usuario")
        .select("nombres")
        .eq("email", user.email)
        .maybeSingle();

      if (error) {
        console.error("Error al obtener datos del usuario:", error.message || error);
        return;
      }

      if (!data) {
        console.warn("No se encontró un usuario con ese correo.");
        return;
      }

      //setUserName(data.nombres);
      setMessages([
        {
          sender: "bot",
          text: `Hola ${data.nombres}, ¿en qué puedo ayudarte hoy?`,
        },
      ]);
    };

    fetchUserData();
  }, [user?.email]);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    if (!user?.id_usuario) {
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
        body: JSON.stringify({ prompt, id_usuario: user.id_usuario }),
      });

      const data = await res.json();
      const botMessage: Message = { sender: "bot", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error al obtener la respuesta" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        prompt,
        setPrompt,
        sendPrompt,
        loading,
        messagesEndRef,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context)
    throw new Error("useChat must be used within ChatProvider");
  return context;
};
