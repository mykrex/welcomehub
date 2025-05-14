'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

interface User {
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

  // Carga el perfil extendido desde tu API
  const loadUserProfile = async () => {
    try {
      const res = await fetch('/api/users/me', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('No autorizado');
      const perfil: User = await res.json();
      setUserState(perfil);
    } catch {
      setUserState(null);
    }
  };

  useEffect(() => {
    // 1) Al montar, recupera sesión si existe
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadUserProfile();
      } else {
        setUserState(null);
      }
    });

    // 2) Escucha cambios de auth (login, logout, refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          loadUserProfile();
        } else {
          setUserState(null);
        }
      }
    );

    // Limpia listener al desmontar
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de UserProvider');
  }
  return context;
}
  /**useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users/me', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error();
        const perfil = await res.json();
        setUserState(perfil);
      } catch {
        setUserState(null);
      }
    };

    fetchUser();
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}**/