"use client";
import { useParams } from "next/navigation";
import { mockCourses } from "@/app/api/cursos/verCurso/mockCourses";
import CourseDescription from "./assets/courseDesc";
import Modules from "./assets/modules";
import ProgressBar from "./assets/ProgressBar";
import StatsCard from "./assets/StatsCard";
import "@/app/components/(layout)/layout.css";
import "./verCurso.css";

export default function VerCursoClient() {
  const params = useParams();
  const id = Number(params?.id);

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
