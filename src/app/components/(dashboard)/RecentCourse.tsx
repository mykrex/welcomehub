// src/app/(authed)/dashboard/assets/RecentCourse.tsx
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import "@/app/(authed)/dashboard/dashboard.css";

import { CursoInscrito } from "@/app/hooks/useCourses";

interface RecentCourseProps {
  cursos: CursoInscrito[];
}

export default function RecentCourse({ cursos }: RecentCourseProps) {
  const cursoMasReciente = useMemo(() => {
    if (!cursos || cursos.length === 0) return null;

    const cursosConFecha = cursos.filter(
      (curso) => curso.last_updated && curso.estado !== "completado"
    );

    if (cursosConFecha.length === 0) {
      const cursosConFechaCompletos = cursos.filter(
        (curso) => curso.last_updated
      );
      if (cursosConFechaCompletos.length === 0) return cursos[0]; // Fallback al primer curso

      return cursosConFechaCompletos.sort(
        (a, b) =>
          new Date(b.last_updated!).getTime() -
          new Date(a.last_updated!).getTime()
      )[0];
    }

    return cursosConFecha.sort(
      (a, b) =>
        new Date(b.last_updated!).getTime() -
        new Date(a.last_updated!).getTime()
    )[0];
  }, [cursos]);

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "completado":
        return "Revisar mi curso completado:";
      case "en_progreso":
        return "Continuar donde lo deje:";
      case "sin_comenzar":
        return "Comenzar mi nuevo curso:";
      default:
        return "Retomar mi curso más reciente:";
    }
  };

  if (!cursoMasReciente) {
    return (
      <>
        <Head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          />
        </Head>

        <div className="recent-course-container">
          <div className="recent-course-header">
            <div className="recent-course-header-content">
              <div className="rc-card-title">No hay cursos disponibles</div>
              <div className="rc-course-title">Próximamente</div>
              <div className="rc-description">
                No tienes cursos asignados en este momento. Contacta a tu
                administrador para más información.
              </div>
            </div>
          </div>

          <div className="recent-course-side">
            <div className="recent-course-image-wrapper shine">
              <div className="rc-placeholder-image">
                <i className="fas fa-book"></i>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>

      <div className="recent-course-container">
        <div className="recent-course-header">
          <div className="recent-course-header-content">
            <div className="rc-card-title">
              {getEstadoTexto(cursoMasReciente.estado)}
            </div>

            <div className="rc-course-title">{cursoMasReciente.titulo}</div>

            <div className="rc-description">{cursoMasReciente.descripcion}</div>

            {cursoMasReciente.last_updated && (
              <div className="rc-last-updated mb-2 text-gray-400">
                Última actividad:{" "}
                {formatearFecha(cursoMasReciente.last_updated)}
              </div>
            )}

            <Link
              href={`/cursos/${cursoMasReciente.id_curso}`}
              className="recent-course-button modern-arrow-button"
            >
              {cursoMasReciente.estado === "completado"
                ? "Revisar Curso"
                : cursoMasReciente.estado === "en_progreso"
                ? "Continuar Curso"
                : "Comenzar Curso"}
            </Link>
          </div>
        </div>

        <div className="recent-course-side">
          <div className="recent-course-image-wrapper shine">
            {cursoMasReciente.portada ? (
              <Image
                src={cursoMasReciente.portada}
                alt={`Portada del curso: ${cursoMasReciente.titulo}`}
                fill
                className="recent-course-image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="rc-placeholder-image">
                <i className="fas fa-graduation-cap"></i>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
