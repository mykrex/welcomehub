"use client";
import React from "react";

//* STYLES *//
import "./progressBar.css";

export default function ProgressBar() {
  return (
    <div className="progress-container">
      <div className="progress-header">
        <div className="progress-title">Mi Progreso del Curso</div>
        <div className="progress-percent">68% completado</div>
      </div>
      <div className="progress-bottom">
        <div className="progress-tracker-wrapper">
          {/* Bar underneath */}
          <div className="bar-total" />
          <div className="bar-completed" style={{ width: "68%" }} />

          {/* Steps on top */}
          <div className="progress-steps">
            <div className="step completed">1</div>
            <div className="step completed">2</div>
            <div className="step completed">3</div>
            <div className="step remaining">4</div>
            <div className="step remaining">5</div>
          </div>
        </div>

        <div className="progress-legend">
          <div className="legend-item">
            <div className="dot green" />
            <div className="legend-label">Completado</div>
          </div>
          <div className="legend-item">
            <div className="dot gray" />
            <div className="legend-label">Restante</div>
          </div>
        </div>
      </div>
    </div>
  );
}
