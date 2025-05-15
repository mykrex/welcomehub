"use client";
import React, { useState } from "react";
import "./modules.css";

import Show from "./icons/ShowIcon";
import Hide from "./icons/HideIcon";

export default function Modules() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleModule = () => setIsExpanded(!isExpanded);

  return (
    <div className="modules-wrapper">
      <div className="modules-header">Modulos</div>

      <div className="module-card">
        <div className="module-summary">
          <div className="module-title">
            <div className="module-status-circle green" />
            <div className="module-name">
              <span className="module-name-number">Modulo 1:</span>
              <span className="module-name-text">
                Fundamentos de la Atención al Cliente
              </span>
            </div>
          </div>

          <div className="module-meta">
            <div className="module-progress completed">
              <div className="module-progress-number">4/4</div>
              <div className="module-progress-label">Completado</div>
            </div>
            <button className="toggle-button" onClick={toggleModule}>
              {isExpanded ? <Hide/> : <Show/>}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="module-content">
            <div className="module-description">
              <div className="description-title">Descripcion de Modulo</div>
              <div className="description-text">
                Este módulo introduce los principios clave de la atención al
                cliente, destacando la importancia de la comunicación efectiva y
                la empatía en la experiencia del consumidor.
              </div>
            </div>

            <div className="module-subsections">
              <div className="subsections-title">Subsecciones</div>
              <div className="subsection-item">
                <div className="subsection-left">
                  <div className="subsection-index">1</div>
                  <div className="subsection-text">
                    Importancia de la atención al cliente en las ventas
                  </div>
                </div>
                <div className="subsection-status completed">Completado</div>
              </div>
              {/* Add more subsections if needed */}
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
}
