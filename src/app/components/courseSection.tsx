// src/app/components/courseSection.tsx

"use client";

import { useRef, useState } from "react";
import CourseCard from "./courseCard";
import { CursoInscrito, CursoOpcional } from "@/app/hooks/useCourses";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
/* Importamos el CSS separado */
import "../(authed)/cursos/cursos.css";

interface CourseSectionProps {
  title: string;
  courses: CursoInscrito[] | CursoOpcional[];
  showStatus?: boolean;
  showObligatory?: boolean;
}

export default function CourseSection({
  title,
  courses,
  showStatus = false,
  showObligatory = false,
}: CourseSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 400;
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } =
      scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const handleCourseClick = async (course: CursoInscrito | CursoOpcional) => {
    const supabase = createClientComponentClient();

    if ("estado" in course && "ruta_archivo" in course && course.ruta_archivo) {
      window.location.href = `/cursos/${course.id_curso}`;
    } else {
      const confirmed = window.confirm(
        `¿Quieres inscribirte al curso "${course.titulo}"?`
      );
      if (confirmed) {
        try {
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser();
          if (authError || !user) throw new Error("No autorizado");

          const { error } = await supabase.from("curso_usuario").insert({
            id_usuario: user.id,
            id_curso: course.id_curso,
            estado: "sin_comenzar",
            last_updated: new Date(),
          });

          if (error) throw error;

          alert("¡Inscripción exitosa!");
          window.location.reload();
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err);
            alert(`Error al inscribirte: ${err.message}`);
          } else {
            console.error(err);
            alert("Ocurrió un error al inscribirte.");
          }
        }
      }
    }
  };

  if (!courses || courses.length === 0) {
    return null;
  }

  return (
    <div className="course-section">
      <h2 className="course-section-title">{title}</h2>

      <div className="scroll-wrapper">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="scroll-button scroll-button-left"
            aria-label="Scroll Left"
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="scroll-container"
        >
          {courses.map((course) => (
            <CourseCard
              key={course.id_curso}
              id_curso={course.id_curso}
              titulo={course.titulo}
              descripcion={course.descripcion}
              portada={course.portada}
              duracion={course.duracion}
              obligatorio={course.obligatorio}
              estado={
                showStatus && "estado" in course ? course.estado : undefined
              }
              showObligatory={showObligatory}
              onClick={() => handleCourseClick(course)}
            />
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="scroll-button scroll-button-right"
            aria-label="Scroll Right"
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
