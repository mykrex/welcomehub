// src/app/(authed)/dashboard/page.tsx
"use client";

//* Styles *//
import "./dashboard.css";


//* Components *//
import CursosVista from "../../components/(dashboard)/CursosVista";
import ProgressBar from "../../components/(dashboard)/ProgressBar";
import OnboardingStats from "../../components/(dashboard)/OnboardingStats";
import RecentCourse from "../../components/(dashboard)/RecentCourse";

//* Import useCourses hook *//
import { useCourses } from "@/app/hooks/useCourses";

export default function Dashboard() {
  const { cursosInscritos, loading, error } = useCourses();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <h2 className="text-gray-400">Cargando dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="dashboard-wrapper">
        <ProgressBar cursos={cursosInscritos || []} />

        <div className="row-one">
          <div className="recent-course-wrapper">
            <RecentCourse cursos={cursosInscritos || []} />
          </div>

          <div className="column-one-stats">
            <OnboardingStats cursos={cursosInscritos || []} />
          </div>
        </div>

        {loading ? (
          <div>Cargando cursos...</div>
        ) : error ? (
          <div>Error al cargar cursos: {error}</div>
        ) : (
          <CursosVista cursos={cursosInscritos || []} />
        )}
      </div>
    </div>
  );
}