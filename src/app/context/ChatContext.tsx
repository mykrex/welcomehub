"use client";

import { useUser } from "../context/UserContext";
import { supabase } from "@/lib/supabase";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

type Message = { sender: "user" | "bot"; text: string };

interface ChatContextProps {
  messages: Message[];
  prompt: string;
  loading: boolean;
  setPrompt: (prompt: string) => void;
  sendPrompt: (customPrompt?: string) => void;
  resetMessages: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

type RawMessage = {
  input_usuario: string | null;
  output_bot: string | null;
};

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const hasSentWelcome = useRef(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendPrompt = useCallback(
    async (customPrompt?: string) => {
      const finalPrompt = customPrompt ?? "";

      if (!user?.id_usuario) {
        alert("Por favor, inicia sesión para enviar un mensaje.");
        return;
      }

      setPrompt("");
      setLoading(true);

      //const newMessages: Message[] = [];

      // if (finalPrompt.trim()) {
      //   newMessages.push({ sender: "user", text: finalPrompt });
      // }

      if (finalPrompt.trim()) {
        setMessages((prev) => [...prev, { sender: "user", text: finalPrompt }]);
      }

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: finalPrompt, id_usuario: user.id_usuario }),
        });

        const data = await res.json();
        console.log("Respuesta recibida:", data.response);

        setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error al obtener la respuesta" },
      ]);
      } finally {
        setLoading(false);
      }
    },
    [user?.id_usuario]
  );

  const resetMessages = () => {
    setMessages([]);
    setPrompt("");
    hasSentWelcome.current = false;
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user?.id_usuario) {
        console.log("No hay usuario autenticado.");
        return;
      }

      console.log("Cargando historial para el usuario:", user.id_usuario);

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

        console.log("Historial obtenido:", historial);

        setMessages(historial);

        if (historial.length === 0 && !hasSentWelcome.current) {
          console.log("Historial vacío, enviando saludo automático...");
          hasSentWelcome.current = true;
          sendPrompt("");
        }
      } catch (error) {
        console.error("Error al obtener el historial de chat:", error);
      }
    };

    fetchChatHistory();
  }, [user?.id_usuario, sendPrompt]);

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
