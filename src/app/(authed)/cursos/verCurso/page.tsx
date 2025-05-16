// Vercurso.tsx
"use client";
import React from "react";

//* STYLES *//
import "@/app/components/(layout)/layout.css";
import "./verCurso.css";

//*Assets*//
import ProgressBar from "./assets/ProgressBar";
import CourseDescription from "./assets/courseDesc";
import StatsCard from "./assets/StatsCard";
import Modules from "./assets/modules";

export default function VerCurso() {
  return (
    <div className="main-content">
      <div className="main-inner">
        {/* MI PROGRESO */}
        <ProgressBar />

        {/* ROW 1 */}
        <div className="course-row">
          <CourseDescription />

          <div className="course-stats">
            <StatsCard />
            <StatsCard />
          </div>
        </div>

        {/* Modulos*/}
        <Modules />
      </div>
    </div>
  );
}
