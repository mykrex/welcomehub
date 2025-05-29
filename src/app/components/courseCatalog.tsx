'use client';

import { useCourses } from '@/app/hooks/useCourses';
import CourseSection from './courseSection';

export default function CourseCatalog() {
  const { 
    cursosInscritos, 
    cursosOpcionales, 
    cursosRecomendados, 
    loading, 
    error 
  } = useCourses();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando catálogo de cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error al cargar los cursos</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // Separamos los cursos inscritos en obligatorios y los 'opcionales'
  const inscritosObligatorios = cursosInscritos?.filter((c) => c.obligatorio) ?? [];
  const inscritosOpcionales = cursosInscritos?.filter((c) => !c.obligatorio) ?? [];

  return (
    <div className="space-y-8">
      {/* Seccion de los cursos inscritos obligatorios a los que esta inscrito el usuario */}
      {inscritosObligatorios.length > 0 && (
        <CourseSection
          title="Mis Cursos Obligatorios"
          courses={inscritosObligatorios}
          showStatus={true}
          showObligatory={true}
        />
      )}

      {/* Seccion de los cursos inscritos no obligatorios a los que esta inscrito el usuario */}
      {inscritosOpcionales.length > 0 && (
        <CourseSection
          title="Mis Cursos Opcionales"
          courses={inscritosOpcionales}
          showStatus={true}
          showObligatory={false}
        />
      )}

      {/* Seccion de cursos recomendados futuramente por Compi */}
      {cursosRecomendados && cursosRecomendados.length > 0 && (
        <CourseSection
          title="Recomendados para ti"
          courses={cursosRecomendados}
          showStatus={false}
        />
      )}

      {/* Seccion de cursos opcionales */}
      {cursosOpcionales && cursosOpcionales.length > 0 && (
        <CourseSection
          title="Explora más cursos"
          courses={cursosOpcionales}
          showStatus={false}
        />
      )}

      {/* Mensaje si es que no hay cursos */}
      {(!cursosInscritos || cursosInscritos.length === 0) && 
       (!cursosOpcionales || cursosOpcionales.length === 0) && 
       (!cursosRecomendados || cursosRecomendados.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No se encontraron cursos disponibles</p>
        </div>
      )}
      
    </div>
  );
}