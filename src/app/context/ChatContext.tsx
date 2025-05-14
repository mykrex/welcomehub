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
  resetMessages: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

type RawMessage = {
  input_usuario: string | null;
  output_bot: string | null;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

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

  const resetMessages = () => {
    setMessages([]);
    setPrompt("");
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user?.id_usuario) return;

      try {
        const { data: messagesData, error } = await supabase
          .from("mensajes")
          .select("input_usuario, output_bot")
          .eq("id_usuario", user.id_usuario)
          .order("timestamp", { ascending: true });

        if (error) throw error;

        const historial: Message[] = [];

        (messagesData as RawMessage[]).forEach((item) => {
          if (item.input_usuario) {
            historial.push({ sender: "user", text: item.input_usuario });
          }
          if (item.output_bot) {
            historial.push({ sender: "bot", text: item.output_bot });
          }
        });

        setMessages(historial);
      } catch (error) {
        console.error("Error al obtener el historial de chat:", error);
      }
    };

    fetchChatHistory();
  }, [user?.id_usuario]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        prompt,
        setPrompt,
        sendPrompt,
        loading,
        messagesEndRef,
        resetMessages,
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
