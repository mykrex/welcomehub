'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CourseContent from '@/app/components/courseContent';
import { CursoInscrito } from '@/app/hooks/useCourses';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CursoInscrito | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const courseId = params?.id;

  useEffect(() => {
    async function fetchCourse() {
      try {
        // Traemos los cursos inscritos del usuario
        const response = await fetch('/api/courses/inscritos', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Error al cargar el curso');
        }

        const courses: CursoInscrito[] = await response.json();
        const foundCourse = courses.find(c => c.id_curso === courseId);

        if (!foundCourse) {
          throw new Error('Curso no encontrado o no tienes acceso');
        }

        // Checamos que si tenga contenido
        if (!foundCourse.ruta_archivo) {
          throw new Error('Este curso no tiene contenido disponible');
        }

        setCourse(foundCourse);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleStatusUpdate = (nuevo_estado: 'sin_comenzar' | 'en_progreso' | 'completado') => {
    if (course) {
      setCourse({ ...course, estado: nuevo_estado });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => router.push('/cursos')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <CourseContent
      id_curso={course.id_curso}
      titulo={course.titulo}
      descripcion={course.descripcion}
      ruta_archivo={course.ruta_archivo!}
      estado={course.estado}
      duracion={course.duracion}
      onStatusUpdate={handleStatusUpdate}
    />
  );
}