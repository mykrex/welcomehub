// Vercurso.tsx
"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { mockCourses } from "@/app/api/cursos/verCurso/mockCourses";

//* STYLES *//
import "@/app/components/(layout)/layout.css";
import "./verCurso.css";

//*Assets*//
import ProgressBar from "./assets/ProgressBar";
import CourseDescription from "./assets/courseDesc";
import StatsCard from "./assets/StatsCard";
import Modules from "./assets/modules";

export default function VerCurso() {
  {
    /* HOOKS 
  const searchParams = useSearchParams();
  const idParam = searchParams?.get("id");
 
  const id = idParam ? Number(idParam) : null;
   */
  }
  const id = 1;
  if (!id) return <div>ID de curso inválido.</div>;

  const course = mockCourses.find((c) => c.id === id);
  if (!course) return <div>Curso no encontrado.</div>;
  return (
    <div className="main-content">
      <div className="main-inner">
        {/* MI PROGRESO */}
        <ProgressBar />

        {/* ROW 1 */}
        <div className="course-row">
          <CourseDescription course={course} />

          <div className="course-stats">
            <StatsCard />
            <StatsCard />
          </div>
        </div>

        {/* Modulos*/}
        <Modules course={course} />
      </div>
    </div>
  );
}
