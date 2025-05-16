"use client";
import React, { useState } from "react";
import "./modules.css";
import { SeeCourse } from "@/app/api/cursos/verCurso/verCurso";


import Show from "./icons/ShowIcon";
import Hide from "./icons/HideIcon";

export default function Modules({ course }: { course: SeeCourse }) {
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);

  const toggleModule = (id: number) => {
    setExpandedModuleId(prev => (prev === id ? null : id));
  };

  return (
    <div className="modules-wrapper">
      <div className="modules-header">Módulos</div>

      {course.modules.map((module) => {
        const isExpanded = expandedModuleId === module.id;

        return (
          <div className="module-card" key={module.id}>
            <div className="module-summary">
              <div className="module-title">
                <div className="module-status-circle green" />
                <div className="module-name">
                  <span className="module-name-number">Módulo {module.id}:</span>
                  <span className="module-name-text">{module.title}</span>
                </div>
              </div>

              <div className="module-meta">
                <div className="module-progress completed">
                  <div className="module-progress-number">
                    {module.completedSubsections}/{module.totalSubsections}
                  </div>
                  <div className="module-progress-label">Completado</div>
                </div>
                <button className="toggle-button" onClick={() => toggleModule(module.id)}>
                  {isExpanded ? <Hide /> : <Show />}
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="module-content">
                <div className="module-description">
                  <div className="description-title">Descripción de Módulo</div>
                  <div className="description-text">{module.description}</div>
                </div>

                <div className="module-subsections">
                  <div className="subsections-title">Subsecciones</div>
                  {module.subsections.map((subsection) => (
                    <div className="subsection-item" key={subsection.id}>
                      <div className="subsection-left">
                        <div className="subsection-index">{subsection.id}</div>
                        <div className="subsection-text">{subsection.text}</div>
                      </div>
                      <div className={`subsection-status ${subsection.status}`}>
                        {subsection.status === "completed" ? "Completado" : "Pendiente"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
