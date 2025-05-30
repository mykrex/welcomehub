"use client";

import { useRef, useState } from "react";
import CourseCard from "./courseCardM";
import { CursoInscrito, CursoOpcional } from "@/app/hooks/useCourses";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
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
    <div className="mb-8">
      <h2 className="text-white text-2xl font-bold mb-4 px-4">{title}</h2>
      <div className="relative group">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
            className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
