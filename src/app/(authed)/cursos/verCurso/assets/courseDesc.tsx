"use client";
import React from "react";

//* STYLES *//
import "./courseDesc.css";

export default function CourseDescription() {
  return (
    <div className="course-description-card">
      <div className="course-title">Atencion al Cliente y Ventas</div>
      <div className="course-meta">
        <div className="meta-item">
          <div className="meta-label">Instructor:</div>
          <div className="meta-value">David Hernandez Sanchez</div>
        </div>
        <div className="meta-item">
          <div className="meta-label">Tiempo estimado de finalización:</div>
          <div className="meta-value">3 horas</div>
        </div>
      </div>

      <div className="course-paragraph">
        Este curso proporciona las habilidades esenciales para interactuar de
        manera efectiva con los clientes, brindando un servicio de calidad y
        potenciando las ventas. Incluye técnicas de comunicación, resolución de
        problemas y estrategias de persuasión para mejorar la experiencia del
        cliente y alcanzar mejores resultados comerciales.
      </div>

      <div className="learning-section">
        <div className="learning-title">Puntos de Aprendizaje</div>

        <div className="learning-columns">
          <div className="learning-column">
            <div className="learning-point">
              <div className="bullet-container">
                <div className="large-circle" />
                <div className="small-circle" />
              </div>
              <div className="learning-text">
                Desarrollar habilidades de comunicación efectiva
              </div>
            </div>
            <div className="learning-point">
              <div className="bullet-container">
                <div className="large-circle" />
                <div className="small-circle" />
              </div>
              <div className="learning-text">
                Aplicar técnicas de ventas estratégicas
              </div>
            </div>
          </div>

          <div className="learning-column">
            <div className="learning-point">
              <div className="bullet-container">
                <div className="large-circle" />
                <div className="small-circle" />
              </div>
              <div className="learning-text">
                Manejar objeciones y resolver problemas con clientes
              </div>
            </div>
            <div className="learning-point">
              <div className="bullet-container">
                <div className="large-circle" />
                <div className="small-circle" />
              </div>
              <div className="learning-text">
                Comprender la psicología del consumidor
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
