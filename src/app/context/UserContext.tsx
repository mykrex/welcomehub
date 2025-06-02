"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

interface UserContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => Promise<void>;
}

export interface User {
  id_usuario: string;
  email: string;
  rol: string;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  puesto?: string;
  en_neoris_desde?: string;
  fecha_nacimiento?: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);

  // Carga el perfil tras el login o el refresh
  const loadUserProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/users/info", {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const perfil: User = await res.json();
      setUserState(perfil);

      // 💡 Llamar a verificar progreso de retos después de cargar perfil
      const retosRes = await fetch("/api/retos/verificarProgreso", {
        credentials: "include",
      });
      if (retosRes.ok) {
        const data = await retosRes.json();
        console.log("Retos verificados:", data);
      } else {
        console.error("Error al verificar progreso de retos");
      }
    } catch {
      setUserState(null);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        await loadUserProfile();
      } else {
        setUserState(null);
      }
    } catch {
      setUserState(null);
    }
  }, [loadUserProfile]);

  // Cerramis la sesion borrando cookies y limpiando el contexto
  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUserState(null);
    await supabase.auth.signOut(); // limpia estado interno
  }, []);

  useEffect(() => {
    // Se recupera sesion y el perfil al montar
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadUserProfile();
      }
    });

    // Escucha los cambios de auth (login, logout, refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          loadUserProfile();
        } else {
          setUserState(null);
        }
      }
    );

    // Refrescamos cada 30 minutos
    const interval = setInterval(refreshSession, 30 * 60 * 1000);

    // Limpiamos el listener y el intervalo al desmontar la pagina
    return () => {
      listener.subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [loadUserProfile, refreshSession]);

  return (
    <UserContext.Provider value={{ user, setUser: setUserState, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de UserProvider");
  }
  return context;
}
