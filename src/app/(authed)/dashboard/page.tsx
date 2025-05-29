"use client";

//* Styles *//
import "@/app/components/(layout)/layout.css"; // Unico que lo usa -> main-content
import "./dashboard.css";

//* Libraries *//
import { useEffect, useState } from "react";

//* Components *//
import CursosVista from "./assets/CursosVista";
import ProgressBar from "./assets/ProgressBar";
import AverageStats from "./assets/AverageStats";
import RecentCourse from "./assets/RecentCourse";
import { Clock } from "lucide-react";

//* Import getCursos desde cursos.ts *//
import { getCursos, Courses } from "@/app/api/cursos/cursos";

export default function Dashboard() {
  const [cursos, setCursos] = useState<Courses[]>([]);

  useEffect(() => {
    getCursos().then((data) => {
      // Aquí asumimos que quieres mostrar cursos asignados, opcionales y recomendados juntos
      const todosLosCursos = [
        ...data.asignedCourses,
        ...data.optionalCourses,
        ...data.recomendedCourses,
      ];
      setCursos(todosLosCursos);
    });
  }, []);

  return (
    <div className="main-content">
      <div className="dashboard-wrapper">
        <ProgressBar />

        <div className="row-one">
          <div className="recent-course-wrapper">
            <RecentCourse />
          </div>

          <div className="column-one-stats">
            <AverageStats
              title="Mi Puntaje Promedio"
              value={45}
              unit="%"
              icon={Clock}
              comparison={{
                percent: "6.7%",
                position: "más",
                direction: "alto",
                color: "#51B6F6",
              }}
            />
            <AverageStats
              title="Mis Cursos Completados"
              value={3}
              unit="de 7"
              icon={Clock}
              comparison={{
                percent: "20%",
                position: "más",
                direction: "alto",
                color: "#51B6F6",
              }}
            />
          </div>
        </div>

        <CursosVista cursos={cursos} />
      </div>
    </div>
  );
}
