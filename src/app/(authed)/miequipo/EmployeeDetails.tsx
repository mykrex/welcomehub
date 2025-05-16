'use client';

import React from 'react';
import './AdminPanel.css';

import { Employee } from '@/app/api/miequipo/miequipo';

interface Props {
  employee: Employee;
}

const dayLabels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const MAX_HOURS = 13;

export default function EmployeeDetails({ employee }: Props) {
  const totalHours = employee.hoursPerDay.reduce((acc, val) => acc + val, 0);
  const avgHours = (totalHours / 7).toFixed(1);

  return (
    <div className="employee-details">
      <div className="employee-header">
        <h3>Gráfica de horas de la semana</h3>
      </div>

      <div className="chart-grid">

  <div className="grid-lines-overlay">
  {Array.from({ length: MAX_HOURS + 1 }, (_, i) => {
  const val = i - 1; // Hides -1 
  const isHidden = i === 0;

  return (
    <div key={i} className="grid-line-row">
      <span className={`y-label ${isHidden ? 'invisible' : ''}`}>
        {isHidden ? '' : val}
      </span>
      <div className={`grid-line ${isHidden ? 'invisible' : ''}`} />
    </div>
  );
}).reverse()}
    <span className="axis-y-title">horas</span>
  </div>

  {/*Bars*/}
  <div className="bars-area">
    {employee.hoursPerDay.map((val, i) => (
      <div key={i} className="bar-column">
        <div
          className="bar"
          style={{ height: `${(val / MAX_HOURS) * 100}%` }}
        />
        <span className="x-label">{dayLabels[i]}</span>
      </div>
    ))}
  </div>
</div>

      <p style={{ textAlign: 'center' }}>
        <strong>Horas totales:</strong> {totalHours} horas — <strong>Promedio diario:</strong> {avgHours} horas
      </p>

      <div className="course-stats">
        <h4 className="titleofcourses">Cursos:</h4>
        <ul>
          <li>✅ Terminados: {employee.courses.completed}</li>
          <li>⏳ En proceso: {employee.courses.inProgress}</li>
          <li>❌ Incompletos: {employee.courses.incomplete}</li>
          <li>⚠️ Sin empezar: {employee.courses.notStarted}</li>
        </ul>
      </div>
    </div>
  );
}