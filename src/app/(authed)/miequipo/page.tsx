'use client';

import { useState, useEffect } from 'react';
import { EmployeeDetailsContainer } from '@/app/components/employeeDetailsContainer';
import { OnboardingProgressChart } from '@/app/components/onboardingProgressChart';
import { EmployeeList } from '@/app/components/employeeList';
import { Employee } from '@/app/types/employee';
import { migrateFromOldStructure} from '@/utils/migrations';
import {Users, User, Book} from 'lucide-react';
import Image from 'next/image';
import '@/app/(authed)/miequipo/AdminPanel.css';
import '@/app/(authed)/miequipo/EmployeeDetails.css';

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

  const [showModal, setShowModal] = useState(false);
  const [modalEmployees, setModalEmployees] = useState<Employee[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSubtitle, setModalSubtitle] = useState('');

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
        
        // Migrar empleados a nueva estructura
        const migratedEmployees = data.employees
          .map((emp: APIEmployee, index: number) => {
            console.log('Migrando empleado:', emp.name || emp.nombre);
            try {
              const migrated = migrateFromOldStructure(emp);
              console.log('Resultado migración:', migrated);
              return migrated;
            } catch (error) {
              console.error(`Error migrando empleado ${index}:`, error);
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

  const handleSegmentClick = (employees: Employee[], title: string, subtitle: string) => {
    setModalEmployees(employees);
    setModalTitle(title);
    setModalSubtitle(subtitle);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
          {/*<p className="text-gray-400">Cargando catálogo de cursos...</p>*/}
          <h2 className="text-gray-400">Cargando Panel de Administración...</h2>
          <p className="text-gray-400">Obteniendo datos del equipo</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <div className="error-content">
          <h2>Error al cargar</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!teamData || teamData.employees.length === 0) {
    return (
      <div className="admin-empty">
        <div className="empty-content">
          <h2>Sin empleados</h2>
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
          <h1>Panel administrativo de Onboarding y Desempeño</h1>
          <p>{teamData.teamName}</p>
          
          <div className="team-stats">
            <span className="stat flex items-center">
              <Users className='w-4 h-4 mr-1'/>
              {teamData.employees.length} empleados
            </span>
            <span className="stat flex items-center">
              <User className='w-4 h-4'/>
              {teamData.employees.filter(emp => emp.isAdmin).length} administrador
            </span>
          </div>

        </div>
      </header>

      {/* Grafica del progreso del onboarding */}
      <OnboardingProgressChart
      employees={teamData.employees}
      teamName={teamData.teamName}
      onSegmentClick={handleSegmentClick}
      />

      <EmployeeList
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      employees={modalEmployees}
      title={modalTitle}
      subtitle={modalSubtitle}
      onEmployeeSelect={setSelectedEmployee}
      />

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
                </div>
                
                <div className="employee-info">
                  <h3>{employee.name}</h3>
                  <div className="employee-stats items-center">
                    <span className="flex">
                      {employee.courses.completed + employee.courses.inProgress + employee.courses.notStarted} cursos 
                      <Book className='w-4 h-4 ml-1'/>
                    </span>
                    {employee.isAdmin && (
                      <span className="admin-label">Administrador</span>
                    )}
                  </div>
                </div>

                <div className="select-indicator">
                  {selectedEmployee?.id === employee.id ? '' : ''}
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
        ) : ('')}
      </section>
    </div>
  );
}