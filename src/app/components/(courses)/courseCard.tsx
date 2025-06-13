// src/app/components/courseCard.tsx

"use client";

import Image from "next/image";
/* Importamos el CSS separado */
import "@/app/(authed)/cursos/cursos.css";

interface CourseCardProps {
  id_curso: string;
  titulo: string;
  descripcion: string;
  portada: string;
  duracion: number;
  obligatorio?: boolean;
  estado?: "sin_comenzar" | "en_progreso" | "completado";
  showObligatory?: boolean;
  onClick?: () => void;
}

export default function CourseCard({
  titulo,
  descripcion,
  portada,
  duracion,
  obligatorio,
  estado,
  showObligatory = false,
  onClick,
}: CourseCardProps) {
  /* La función ahora retorna la clase CSS correspondiente */
  const getEstadoColor = (estado?: string) => {
    switch (estado) {
      case "completado":
        return "estado-completado";
      case "en_progreso":
        return "estado-en-progreso";
      case "sin_comenzar":
        return "estado-sin-comenzar";
      default:
        return "";
    }
  };

  const getEstadoTexto = (estado?: string) => {
    switch (estado) {
      case "completado":
        return "Completado";
      case "en_progreso":
        return "En progreso";
      case "sin_comenzar":
        return "Sin comenzar";
      default:
        return "";
    }
  };

  return (
    <div onClick={onClick} className="course-card">
      <div className="image-wrapper">
        <Image
          src={portada}
          alt={titulo}
          width={400}
          height={192}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="course-image"
        />

        <div className="status-container">
          {estado && (
            <div className={`status-badge ${getEstadoColor(estado)}`}>
              {getEstadoTexto(estado)}
            </div>
          )}
        </div>
      </div>

      <div className="course-content">
        <div className="course-text">
          <h3 className="course-title">{titulo}</h3>

          <p className="course-description">{descripcion}</p>
        </div>

        <div className="course-footer">
          <span>{duracion} min</span>

          {!estado && <span>Disponible</span>}
          {showObligatory && obligatorio && (
            <div className="obligatory-badge">Obligatorio</div>
          )}
        </div>
      </div>
    </div>
  );
}
