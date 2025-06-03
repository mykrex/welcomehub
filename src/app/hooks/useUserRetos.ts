import { useState, useEffect } from 'react';

export interface UserReto {
  id_reto: string;
  terminado: string;
  completado: boolean;
  reto: {
    puntos: number;
    titulo_reto: string;
    descripcion_reto: string;
    tipo_reto: string;
  };
}

interface UseUserRetosResult {
  userRetos: UserReto[] | null;
  loading: boolean;
  error: string | null;
}

export function useUserRetos(): UseUserRetosResult {
  const [userRetos, setUserRetos] = useState<UserReto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserRetos() {
      try {
        setLoading(true);
        const res = await fetch('/api/retos/getUserRetos', { credentials: 'include' });
        if (!res.ok) throw new Error('Error al cargar retos del usuario');
        const data = await res.json();
        setUserRetos(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRetos();
  }, []);

  return { userRetos, loading, error };
}
