// src/app/(authed)/dashboard/page.tsx
"use client";

//* Styles *//
import "@/app/(authed)/cursos//verCurso/[id]/verCurso.css"; // TODO: QUITAR
import "@/app/components/(layout)/layout.css"; // Unico que lo usa -> main-content
import "./dashboard.css";

//* Libraries *//
//import { useEffect, useState } from "react";

//* Components *//
import CursosVista from "./assets/CursosVista";
import ProgressBar from "./assets/ProgressBar";
import OnboardingStats from "./assets/OnboardingStats";
import RecentCourse from "./assets/RecentCourse";
//import { Clock } from "lucide-react";

//* Import useCourses hook *//
import { useCourses } from "@/app/hooks/useCourses";

export default function Dashboard() {
  const { cursosInscritos, loading, error } = useCourses();

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