import { useState, useEffect } from 'react';

export interface CursoInscrito {
  id_curso: string;
  titulo: string;
  descripcion: string;
  portada: string;
  duracion: number;
  obligatorio: boolean;
  estado: 'sin_comenzar' | 'en_progreso' | 'completado';
  ruta_archivo?: string;
}

export interface CursoOpcional {
  id_curso: string;
  titulo: string;
  descripcion: string;
  portada: string;
  duracion: number;
  obligatorio: boolean;
}

interface UseCursosResult {
  cursosInscritos: CursoInscrito[] | null;
  cursosOpcionales: CursoOpcional[] | null;
  cursosRecomendados: CursoOpcional[] | null;
  loading: boolean;
  error: string | null;
}

export function useCourses(): UseCursosResult {
  const [cursosInscritos, setCursosInscritos] = useState<CursoInscrito[] | null>(null);
  const [cursosOpcionales, setCursosOpcionales] = useState<CursoOpcional[] | null>(null);
  const [cursosRecomendados, setCursosRecomendados] = useState<CursoOpcional[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllCourses() {
      try {
        setLoading(true);
        
        // Se ejecutan todas las peticiones de cada tipo de curso en paralelo
        const [inscritosRes, opcionalesRes, recomendadosRes] = await Promise.all([
          fetch('/api/courses/inscritos', { credentials: 'include' }),
          fetch('/api/courses/opcionales', { credentials: 'include' }),
          fetch('/api/courses/recomendados', { credentials: 'include' })
        ]);

        // Verificamos si hay respuestas en cada uno
        if (!inscritosRes.ok || !opcionalesRes.ok || !recomendadosRes.ok) {
          throw new Error('Error al cargar cursos');
        }

        // Se parsean las respuestas
        const [inscritosData, opcionalesData, recomendadosData] = await Promise.all([
          inscritosRes.json(),
          opcionalesRes.json(),
          recomendadosRes.json()
        ]);

        setCursosInscritos(inscritosData);
        setCursosOpcionales(opcionalesData);
        setCursosRecomendados(recomendadosData);

      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchAllCourses();
  }, []);

  return { 
    cursosInscritos, 
    cursosOpcionales, 
    cursosRecomendados, 
    loading, 
    error 
  };
}