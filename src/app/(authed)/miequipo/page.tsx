// pages/miequipo/index.tsx - Panel de Administrador Final
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { EmployeeDetailsContainer } from '@/app/components/employeeDetailsContainer';
import { Employee } from '@/app/types/employee';
import { migrateFromOldStructure, debugAPIResponse } from '@/utils/migrations';
import '@/app/(authed)/miequipo/AdminPanel.css';

interface TeamData {
  teamName: string;
  employees: Employee[];
}

interface APIEmployee {
  id: string; // Cambiado a string para UUIDs
  name: string;
  photo?: string;
  isAdmin?: boolean;
  courses?: {
    completed: number;
    inProgress: number;
    notStarted: number;
    sin_comenzar?: number;
  };
  obligatoryCourses?: {
    completed: number;
    inProgress: number;
    notStarted: number;
    sin_comenzar?: number;
  };
  [key: string]: unknown;
}

export default function AdminPanel() {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del equipo
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/miequipo/miequipo');
        
        if (!response.ok) {
          throw new Error('Error al obtener datos del equipo');
        }
        
        const data = await response.json();
        
        // 🔍 DEBUG: Usar función especializada de debug
        debugAPIResponse(data);
        
        // Migrar empleados a nueva estructura
        const migratedEmployees = data.employees
          .map((emp: APIEmployee, index: number) => {
            console.log('🔄 Migrando empleado:', emp.name || emp.nombre);
            try {
              const migrated = migrateFromOldStructure(emp);
              console.log('✅ Resultado migración:', migrated);
              return migrated;
            } catch (error) {
              console.error(`❌ Error migrando empleado ${index}:`, error);
              return null;
            }
          })
          .filter((emp: Employee | null): emp is Employee => emp !== null); // Filtrar empleados que fallaron
        
        setTeamData({
          teamName: data.teamName,
          employees: migratedEmployees
        });
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  // Estados de carga
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-content">
          <div className="spinner"></div>
          <h2>Cargando Panel de Administración...</h2>
          <p>Obteniendo datos del equipo</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <div className="error-content">
          <h2>❌ Error al cargar</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!teamData || teamData.employees.length === 0) {
    return (
      <div className="admin-empty">
        <div className="empty-content">
          <h2>👥 Sin empleados</h2>
          <p>No se encontraron empleados en tu equipo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {/* Header del panel */}
      <header className="admin-header">
        <div className="header-content">
          <h1>{teamData.teamName}</h1>
          <p>Panel de Administración - Gestión de Horas y Aprobaciones</p>
          <div className="team-stats">
            <span className="stat">
              👥 {teamData.employees.length} empleados
            </span>
            <span className="stat">
              👑 {teamData.employees.filter(emp => emp.isAdmin).length} administradores
            </span>
          </div>
        </div>
      </header>

      {/* Selector de empleado */}
      <section className="employee-selector-section">
        <div className="selector-content">
          <h2>Seleccionar Empleado</h2>
          <div className="employees-grid">
            {teamData.employees.map((employee, index) => (
              <div
                key={employee.id || `employee-${index}`}
                className={`employee-card ${
                  selectedEmployee?.id === employee.id ? 'selected' : ''
                }`}
                onClick={() => setSelectedEmployee(employee)}
              >
                <div className="employee-avatar">
                  <Image 
                    src={employee.photo} 
                    alt={employee.name}
                    width={80}
                    height={80}
                    className="employee-photo-img"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder_profile.png';
                    }}
                  />
                  {employee.isAdmin && (
                    <div className="admin-badge">👑</div>
                  )}
                </div>
                
                <div className="employee-info">
                  <h3>{employee.name}</h3>
                  <div className="employee-stats">
                    <span>
                      📚 {employee.courses.completed + employee.courses.inProgress + employee.courses.notStarted} cursos
                    </span>
                    {employee.isAdmin && (
                      <span className="admin-label">Administrador</span>
                    )}
                  </div>
                </div>

                <div className="select-indicator">
                  {selectedEmployee?.id === employee.id ? '✅' : '👆'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detalles del empleado seleccionado */}
      <section className="employee-details-section">
        {selectedEmployee ? (
          <EmployeeDetailsContainer employee={selectedEmployee} />
        ) : (
          <div className="no-employee-selected">
            <div className="no-selection-content">
              <h3>👆 Selecciona un empleado</h3>
              <p>Elige un empleado de la lista superior para ver sus horas trabajadas, semanas y gestionar aprobaciones.</p>
              <div className="features-preview">
                <div className="feature">
                  <span className="feature-icon">📊</span>
                  <span>Gráficas de horas por proyecto</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📅</span>
                  <span>Historial de semanas</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✅</span>
                  <span>Aprobación de timecard</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📚</span>
                  <span>Progreso de cursos</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}