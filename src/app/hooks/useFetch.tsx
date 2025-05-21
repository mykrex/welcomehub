import { useState, useEffect } from 'react';

export interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook generico para hacer fetch a un endpoint
 * - url: ruta a la API (relative o absoluta)
 * - options: cualquier RequestInit (metodo, headers, body . . .)
 *
 * Nota: para evitar re-fetches innecesarios, se memoiza `options` con useMemo()
 * en el componente que llame a este hook, si es un objeto literal
 */
export function useFetch<T>( url: string, options?: RequestInit): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(url, {
      credentials: 'include', // envio de cookies
      ...options,
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || res.statusText);
        if (isMounted) setData(json as T);
      })
      .catch((err: Error) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [url, options]);

  return { data, loading, error };
}