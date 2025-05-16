// Vercurso.tsx
import React from "react";
import { mockCourses } from "@/app/api/cursos/verCurso/mockCourses";

//* STYLES *//
import "@/app/components/(layout)/layout.css";
import "./verCurso.css";

//*Assets*//
import ProgressBar from "./assets/ProgressBar";
import CourseDescription from "./assets/courseDesc";
import StatsCard from "./assets/StatsCard";
import Modules from "./assets/modules";

export default function VerCurso({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const course = mockCourses.find((c) => c.id === id);

  if (!course) return <div>Curso no encontrado</div>;

  return (
    <div className="main-content">
      <div className="main-inner">
        <ProgressBar />

        <div className="course-row">
          <CourseDescription course={course} />
          <div className="course-stats">
            <StatsCard />
            <StatsCard />
          </div>
        </div>

        <Modules course={course} />
      </div>
    </div>
  );
}