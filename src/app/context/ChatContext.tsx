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

import politicas from "../docs/politicas.json";

type Action = { label: string; href: string};

type Message = { 
  sender: "user" | "bot"; 
  text: string 
  actions?: Action[];
};

interface ChatContextProps {
  messages: Message[];
  prompt: string;
  loading: boolean;
  setPrompt: (prompt: string) => void;
  sendPrompt: (customPrompt?: string) => void;
  resetMessages: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  // Mantener scroll al final
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Función para enviar prompt a la API
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
        setMessages(prev => [...prev, { sender: "user", text: finalPrompt }]);
      }
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: finalPrompt, id_usuario: user.id_usuario }),
        });
        const data = await res.json();
        setMessages(prev => [
          ...prev, 
          { 
            sender: "bot", 
            text: data.response,
            actions: data.actions 
          }
        ]);
      } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        setMessages(prev => [...prev, { sender: "bot", text: "Error al obtener la respuesta" }]);
      } finally {
        setLoading(false);
      }
    },
    [user?.id_usuario]
  );

  // resetear mensajes y estado
  const resetMessages = () => {
    setMessages([]);
    setPrompt("");
  };

  // Inicializar chat con saludo personalizado y cargar historial
  useEffect(() => {
    const initChat = async () => {
      if (!user?.id_usuario) {
        setMessages([]);
        return;
      }

      // Obtener nombre real del usuario desde tabla 'usuario'
      const { data: usuarioData, error: usuarioError } = await supabase
        .from("usuario")
        .select("nombres, rol")
        .eq("id_usuario", user.id_usuario)
        .single();

      const userName = !usuarioError && usuarioData?.nombres
        ? usuarioData.nombres
        : "usuario";
      const userRole = !usuarioError && usuarioData?.rol
        ? usuarioData.rol.toLowerCase()
        : "";

      // Obtener historial de mensajes
      const { data: messagesData, error: historyError } = await supabase
        .from("mensajes")
        .select("input_usuario, output_bot")
        .eq("id_usuario", user.id_usuario)
        .order("timestamp", { ascending: true });
      if (historyError) {
        console.error("Error al obtener historial:", historyError);
        return;
      }

      // Mapear a Message[]
      // construir arreglo de historial
      const historialDB: Message[] = [];
      messagesData?.forEach(item => {
        if (item.input_usuario) historialDB.push({ sender: "user", text: item.input_usuario });
        if (item.output_bot)   historialDB.push({ sender: "bot",  text: item.output_bot });
      });

      // Primer saludo o bienvenida de vuelta
      const greeting = historialDB.length === 0
        ? `¡Hola ${userName}! Soy Compi, tu asistente virtual. Te estare acompañando en tu experiencia dentro de Welcomehub.`
        : `Hola de vuelta ${userName}! Estoy aquí para cualquier tema que tengas.`;
      
      const shortcuts: Action[] = [
        { label: "Dashboard", href: "/dashboard"},
        { label: "Mis Cursos", href: "/cursos" },
        { label: "Mi Perfil", href: "/mi_perfil"},
        { label: "Retos", href: "/retos"},
        { label: "Neoris", href: "/neoris"},
        { label: "Time Card", href: "/timecard"}
      ];

      if (historialDB.length === 0) {
        let tour;

        if (userRole === "administrador"){
          tour = politicas.filter(p => p.id.startsWith("admin-"));
        } else {
          tour = politicas.filter(p => p.id.startsWith("tour-"));
        }

        if (!tour.length) {
          tour = politicas.slice(0, 2);
        }

        // Construir texto del tour: titulo + content
        const tourText = tour.map((pol) => `${pol.title}\n${pol.content}`).join("\n\n");
        
        // Montar mensaje
        setMessages([
          { sender: "bot", text: greeting, actions: shortcuts },
          {
            sender: "bot",
            text: 
              userRole === "administrador"
                ? "¡Hola admin! Aqui tienes un recorrido rápido por las funcionalidades de Welcomehub:\n\n" + tourText
                : "Para empezar, te daré un recorrido por Welcomehub:\n\n" + tourText,
            actions: shortcuts
          },
        ]);
      } else {
        setMessages([{ sender: "bot", text: greeting, actions: shortcuts }, ...historialDB]);
      }
    };
    initChat();
  }, [user?.id_usuario]);

  return (
    <ChatContext.Provider
      value={{ messages, prompt, setPrompt, sendPrompt, loading, messagesEndRef, resetMessages }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
