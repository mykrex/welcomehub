import { useState, useEffect } from 'react';

export interface RetoCount {
  id_reto: string;
  veces_completado: number;
}

interface UseUserRetosCountResult {
  counts: RetoCount[] | null;
  loading: boolean;
  error: string | null;
}

export function useUserRetosCount(): UseUserRetosCountResult {
  const [counts, setCounts] = useState<RetoCount[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      try {
        setLoading(true);
        const res = await fetch('/api/retos/userRetosCount', { credentials: 'include' });
        if (!res.ok) throw new Error('Error al contar retos del usuario');
        const data = await res.json();
        setCounts(data.counts);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

  return { counts, loading, error };
}
