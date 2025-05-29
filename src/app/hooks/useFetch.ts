'use client';
import { useState, useEffect } from "react";

export interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string, options?: RequestInit): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading(true);

    fetch(url, {
      credentials: "include", // envía cookies
      ...options,
      signal, // agrega señal para cancelar fetch si el componente se desmonta
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || res.statusText);
        setData(json as T);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => abortController.abort();
  }, [url, options]);

  return { data, loading, error };
}
