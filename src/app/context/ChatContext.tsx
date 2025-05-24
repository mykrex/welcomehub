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

  // funcion para mandar prompts al backend
  const sendPrompt = useCallback(
    async (customPrompt?: string) => {
      const finalPrompt = customPrompt ?? "";

      if (!user?.id_usuario) {
        alert("Por favor, inicia sesión para enviar un mensaje.");
        return;
      }

      setPrompt("");
      setLoading(true);

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

  // init chat: carga el historial y saludo
  useEffect(() => {
    const initChat = async () => {
      if (!user?.id_usuario) {
        console.log("No hay usuario autenticado");
        return;
      };

      // obtener nombre del usuario
      const { data: userInfo, error: userError } = await supabase
        .from("usuario")
        .select("nombres")
        .eq("ID_usuario", user.id_usuario)
        .single();

      const userName = !userError && userInfo?.nombres
        ? userInfo.nombres
        : "ususario";

      // obtener historial de mensajes
      const { data: messagesData, error: historyError } = await supabase
        .from("mensajes")
        .select("input_usuario, output_bot")
        .eq("id_usuario", user.id_usuario)
        .order("timestamp", { ascending: true });

      if (historyError) {
        console.error("Error al obtener el historial de chat:", historyError);
        return;
      }

      // Mapear a Message[]
      const historialDB: Message[] = [];
      (messagesData as { input_usuario: string | null; output_bot: string | null }[]).forEach((item) => {
        if (item.input_usuario) {
          historialDB.push({ sender: "user", text: item.input_usuario });
        }
        if (item.output_bot) {
          historialDB.push({ sender: "bot", text: item.output_bot });
        }
      });

      // Saludo inicial o de bienvenida de vuelta
      if( !hasSentWelcome.current ){
        hasSentWelcome.current = true;

        if (historialDB.length === 0) {
          setMessages([
            {
              sender: "bot",
              text: `¡Bienvenido ${userName}!, soy Compi, tu asistente virtual. ¿En qué puedo ayudarte hoy?`,
            },
          ]);
        } else {
          setMessages([
            {
              sender: "bot",
              text: `¡Bienvenido de vuelta ${userName}!, Estoy aqui para cualquier tema que tengas.`,
            },
            ...historialDB,
          ]);
        }
      } else {
        // Cargar historial completo tras saludo
        setMessages(historialDB);
      }
    };
    initChat();
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
