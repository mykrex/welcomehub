import React, { useEffect, useState } from "react";
import ProgressBar from "@/app/components/ProgressBar";
import { Legend } from "@/app/components/Legend";
import { CourseCard } from "@/app/components/CourseCard";
import { ScoreCard } from "@/app/components/ScoreCard";
import { RecentCourse } from "./components/RecentCourse";
import  useCourses  from "@/app/hooks/useCourses";
import { useDashboardStats } from "@/app/hooks/useDashboardStats";


export default function Dashboard() {
  const { courses, recentCourse } = useCourses();
  const { completionPercentage, averageTime, totalAttempts } = useDashboardStats();}

  { color: "#448AFF", label: "Completado" }
    { color: "#06D6A0", label: "Hecho Hoy" }
    { color: "#B0BEC5", label: "Restante" }

  return (
    <div className="dashboard-container p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">

        {/* Statistics Section */}
        <ScoreCard title="Progreso completado" value={`${completionPercentage}%`} />
        <ScoreCard title="Tiempo promedio" value={`${averageTime} minutos`} />
        <ScoreCard title="Intentos totales" value={totalAttempts} />
      </div>

      {/* Progress and Legend */}
      <div className="flex items-center gap-4 mb-8">
        <ProgressBar percentage={completionPercentage} />
        <Legend
          items={[
            { color: "green", label: "Completado" },
            { color: "gray", label: "Pendiente" },
          ]}
        />
      </div>

      

      {/* Recent Course Section */}
      {recentCourse && (
        <RecentCourse
          title={recentCourse.title}
          progress={recentCourse.progress}
        />
      )}

      {/* Courses List */}
      <h2 className="text-xl font-bold mb-4">Tus Cursos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
