import { useState, useEffect } from 'react';

export interface Reto {
  id_reto: string;
  puntos: number;
  titulo_reto: string;
  descripcion_reto: string;
  tipo_reto: string;
}

interface UseRetosResult {
  retos: Reto[] | null;
  loading: boolean;
  error: string | null;
}

export function useRetos(): UseRetosResult {
  const [retos, setRetos] = useState<Reto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRetos() {
      try {
        setLoading(true);
        const res = await fetch('/api/retos/getRetos', { credentials: 'include' });
        if (!res.ok) throw new Error('Error al cargar retos');
        const data = await res.json();
        setRetos(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchRetos();
  }, []);

  return { retos, loading, error };
}
