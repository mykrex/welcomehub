'use client';
import React from 'react';
import './logros.css';

/** Assets */
import Badge from './icons/Badge';

export default function Logros() {
  return (
    <div className="logros-container">
      <div className="logros-header-wrapper">
        <div className="logros-title">Logros</div>
      </div>
      <div className="logros-cards-wrapper">
        {/* Bienvenida Estelar */}
        <div className="logro-card">
          <div className="logro-icon-wrapper">
            <Badge />
          </div>
          <div className="logro-text">
            <div className="logro-name">Bienvenida Estelar</div>
            <div className="logro-desc">Iniciar sesión con WelcomeHub</div>
          </div>
          <div className="logro-date-wrapper">
            <div className="logro-date-label">Ganado:</div>
            <div className="logro-date-value">Febrero 2025</div>
          </div>
        </div>

        {/* Explorador Curioso */}
        <div className="logro-card">
          <div className="logro-icon-wrapper">
            <Badge variant="gold" />
          </div>
          <div className="logro-text">
            <div className="logro-name">Explorador Curioso</div>
            <div className="logro-desc">Terminar un curso no asignado</div>
          </div>
          <div className="logro-date-wrapper">
            <div className="logro-date-label">Ganado:</div>
            <div className="logro-date-value">Marzo 2025</div>
          </div>
        </div>

        {/* Progreso Continuo */}
        <div className="logro-card">
          <div className="logro-icon-wrapper">
          <Badge variant="red" />
          </div>
          <div className="logro-text">
            <div className="logro-name">Progreso Continuo</div>
            <div className="logro-desc">Completar 10 retos</div>
          </div>
          <div className="logro-date-wrapper">
            <div className="logro-date-label">Ganado:</div>
            <div className="logro-date-value">Abril 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
}
