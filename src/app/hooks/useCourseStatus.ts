import { useState } from "react";

export function useCourseStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCourseStatus = async (
    id_curso: string,
    nuevo_estado: "sin_comenzar" | "en_progreso" | "completado"
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/courses/update_status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id_curso, nuevo_estado }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar estado");
      }

      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { updateCourseStatus, loading, error };
}
