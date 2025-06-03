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
  loadingUser: boolean;
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
  const [loadingUser, setLoadingUser] = useState(true);

  const loadUserProfile = useCallback(async () => {
    setLoadingUser(true);
    try {
      const res = await fetch("/api/users/info", {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const perfil: User = await res.json();
      setUserState(perfil);

      await fetch("/api/retos/verificarProgreso", {
        credentials: "include",
      });
    } catch {
      setUserState(null);
    } finally {
      setLoadingUser(false);
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

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUserState(null);
    await supabase.auth.signOut();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadUserProfile();
      } else {
        setLoadingUser(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          loadUserProfile();
        } else {
          setUserState(null);
          setLoadingUser(false);
        }
      }
    );

    const interval = setInterval(refreshSession, 30 * 60 * 1000);

    return () => {
      listener.subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [loadUserProfile, refreshSession]);

  return (
    <UserContext.Provider value={{ user, setUser: setUserState, logout, loadingUser }}>
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
