'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id_usuario: string;
  email: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  puesto: string;
  rol: string;
  en_neoris_desde: string;
  fecha_nacimiento: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users/me', {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('No autorizado');

        const userData: User = await res.json();
        setUserState(userData);
      } catch (error) {
        console.warn('⚠️ No se pudo obtener el perfil de usuario:', error);
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
}