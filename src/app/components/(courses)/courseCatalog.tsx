"use client";

import { useCourses } from "@/app/hooks/useCourses";
import CourseSection from "./courseSection";

import "@/app/(authed)/cursos/cursos.css";

export default function CourseCatalog() {
  const {
    cursosInscritos,
    cursosOpcionales,
    cursosRecomendados,
    loading,
    error,
  } = useCourses();

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader-content">
          <div className="spinner"></div>
          <p className="loader-text">Cargando catálogo de cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-title">Error al cargar los cursos</p>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  const inscritosObligatorios =
    cursosInscritos?.filter((c) => c.obligatorio) ?? [];
  const inscritosOpcionales =
    cursosInscritos?.filter((c) => !c.obligatorio) ?? [];

  return (
    <div className="catalog-main">
      {/* Sección: cursos obligatorios inscritos */}
      {inscritosObligatorios.length > 0 && (
        <CourseSection
          title="Mis Cursos Obligatorios"
          courses={inscritosObligatorios}
          showStatus={true}
          showObligatory={true}
        />
      )}

      {/* Sección: cursos opcionales inscritos */}
      {inscritosOpcionales.length > 0 && (
        <CourseSection
          title="Mis Cursos Opcionales"
          courses={inscritosOpcionales}
          showStatus={true}
          showObligatory={false}
        />
      )}

      {/* Sección: cursos recomendados */}
      {cursosRecomendados && cursosRecomendados.length > 0 && (
        <CourseSection
          title="Recomendados para ti"
          courses={cursosRecomendados}
          showStatus={false}
        />
      )}

      {/* Sección: cursos opcionales NO inscritos */}
      {cursosOpcionales && cursosOpcionales.length > 0 && (
        <CourseSection
          title="Explora más cursos"
          courses={cursosOpcionales}
          showStatus={false}
        />
      )}

      {/* Mensaje si no hay cursos */}
      {(!cursosInscritos || cursosInscritos.length === 0) &&
        (!cursosOpcionales || cursosOpcionales.length === 0) &&
        (!cursosRecomendados || cursosRecomendados.length === 0) && (
          <div className="empty-container">
            <p className="empty-text">No se encontraron cursos disponibles</p>
          </div>
        )}
    </div>
  );
}
