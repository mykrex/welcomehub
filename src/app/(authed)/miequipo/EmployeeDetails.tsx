'use client';

import React from 'react';
import './AdminPanel.css';
import Image from 'next/image';

import { Employee } from '@/app/api/miequipo/miequipo';

interface Props {
  employee: Employee;
}

const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function EmployeeDetails({ employee }: Props) {
  const totalHours = employee.hoursPerDay.reduce((acc, val) => acc + val, 0);
  const avgHours = (totalHours / 7).toFixed(1);
  const maxHours = Math.max(...employee.hoursPerDay);
  const roundedMax = Math.ceil((maxHours || 8) / 2) * 2;

  return (
    <>
      <hr className="section-divider" />
      <div className="employee-details">
        <div className="employee-header">
          <Image
            src={employee.photo}
            alt={employee.name}
            width={40}
            height={40}
            className="avatar"
          />
          <h3>{employee.name}</h3>
        </div>

        <div className="bar-chart-wrapper">
          <div className="y-axis">
            {[...Array(roundedMax / 2 + 1)].map((_, i) => {
              const label = roundedMax - i * 2;
              return (
                <div key={i} className="y-label">
                  <span>{label}</span>
                  <div className="y-line" />
                </div>
              );
            })}
          </div>
          <div className="bar-chart">
            {employee.hoursPerDay.map((hours, idx) => (
              <div key={idx} className="bar-wrapper">
                <div className="bar-value">{hours}</div>
                <div
                  className="bar"
                  style={{ height: `${(hours / roundedMax) * 100}%` }}
                />
                <span>{dayLabels[idx]}</span>
              </div>
            ))}
          </div>
        </div>

        <p><strong>Horas totales:</strong> {totalHours} — <strong>Promedio diario:</strong> {avgHours}h</p>

        <hr className="section-divider" />

        <div className="course-stats">
          <h4>Cursos</h4>
          <ul>
            <li>✅ Terminados: {employee.courses.completed}</li>
            <li>⏳ En proceso: {employee.courses.inProgress}</li>
            <li>❌ Incompletos: {employee.courses.incomplete}</li>
            <li>📄 Sin empezar: {employee.courses.notStarted}</li>
          </ul>
        </div>
      </div>
    </>
  );
}