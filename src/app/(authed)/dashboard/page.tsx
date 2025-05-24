import React from "react";
import ProgressBar from "@/app/components/ProgressBar";
import { Legend } from "@/app/components/Legend";
import { CourseCard } from "@/app/components/CourseCard";
import { ScoreCard } from "@/app/components/ScoreCard";
import { RecentCourse } from "@/app/components/RecentCourse";
import { useCourses } from "@/app/hooks/useCourses";
import { useProgress } from "@/app/hooks/useProgress";

export default function Dashboard() {
  const { courses, recentCourse } = useCourses();
  const { completionPercentage, averageTime, totalAttempts } = useProgress();

  return (
    <div className="dashboard-container p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <ScoreCard title="Progreso completado" value={`${completionPercentage}%`} />
        <ScoreCard title="Tiempo promedio" value={`${averageTime} minutos`} />
        <ScoreCard title="Intentos totales" value={totalAttempts} />
      </div>

      {/* Barra de progreso y leyenda */}
      <div className="flex items-center gap-4 mb-8">
        <ProgressBar percentage={completionPercentage} />
        <Legend
          items={[
            { color: "#448AFF", label: "Completado" },
            { color: "#06D6A0", label: "Hecho Hoy" },
            { color: "#B0BEC5", label: "Restante" },
          ]}
        />
      </div>

      {/* Curso reciente */}
      {recentCourse && (
  <RecentCourse
    title={recentCourse.title}
    description={recentCourse.description}
    status={
      ["complete", "in_progress", "not_started"].includes(recentCourse.status)
        ? (recentCourse.status as "complete" | "in_progress" | "not_started")
        : "not_started"
    }
  />
)}


      {/* Lista de cursos */}
      <h2 className="text-xl font-bold mb-4">Tus Cursos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
