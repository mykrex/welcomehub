import { getCurrentWeek, getWeekKey } from "@/utils/weekUtils";
import { useState, useEffect } from "react";
import { useEmployeeWeeks } from "../../hooks/useEmployeeWeeks";
import { Employee } from "../../types/employee";
import { HoursChart } from "./hoursCharts";
import { WeekApprovalPanel } from "./weekApprovalPanel";
import { WeekSelector } from "./weekSelector";
import { CoursesGraphSection } from "./coursesGraphSection";
import Image from "next/image";
import '@/app/(authed)/mi_equipo/mi_equipo.css';

interface EmployeeDetailsContainerProps {
  employee: Employee;
}

export const EmployeeDetailsContainer: React.FC<EmployeeDetailsContainerProps> = ({
  employee
}) => {
  const { weeks, proyectosDisponibles, loading, error, approveWeek } = useEmployeeWeeks(employee.id); // Ya no necesita conversión
  const [selectedWeekKey, setSelectedWeekKey] = useState<string>('');
  
  const currentWeek = getCurrentWeek();
  const currentWeekKey = getWeekKey(currentWeek);

  // Seleccionar semana actual por defecto
  useEffect(() => {
    if (weeks.length > 0 && !selectedWeekKey) {
      const current = weeks.find(w => w.inicio_semana === currentWeekKey);
      setSelectedWeekKey(current?.inicio_semana || weeks[0].inicio_semana);
    }
  }, [weeks, currentWeekKey, selectedWeekKey]);

  const selectedWeek = weeks.find(w => w.inicio_semana === selectedWeekKey);
  const isCurrentWeek = selectedWeekKey === currentWeekKey;

  // Loading states
  if (loading) {
    return (
      <div className="employee-details-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando datos del empleado...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-details-container">
        <div className="error-state">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Si no hay semanas disponibles
  if (weeks.length === 0) {
    return (
      <div className="employee-details-container">
        <div className="employee-header">
          <h2>{employee.name}</h2>
          <Image src={employee.photo} alt={employee.name} className="employee-photo" />
        </div>
        <div className="no-weeks-state">
          <h3>Sin semanas registradas</h3>
          <p>Este empleado aún no tiene semanas de trabajo registradas.</p>
        </div>
        
        {/* Mostrar grafica de cursos aunque no haya semanas */}
        <CoursesGraphSection employee={employee} />
      </div>
    );
  }

  // Si selectedWeekKey aún está vacío, usar la primera semana disponible
  const weekKeyToUse = selectedWeekKey || weeks[0]?.inicio_semana;
  
  // Validar que tenemos una fecha valida antes de crear la semana
  try {
    if (weekKeyToUse) {
      const testDate = new Date(weekKeyToUse);
      if (isNaN(testDate.getTime())) {
        throw new Error('Fecha inválida');
      }
      // weekDays variable removed as it's not used
    } else {
      // Fallback: usar semana actual  
      // weekDays variable removed as it's not used
    }
  } catch (err) {
    console.error('Error creando semana:', err);
    // Fallback a semana actual - weekDays variable removed as it's not used
  }

  return (
    <div className="employee-details-container">
      <div className="employee-header">
        <h2>{employee.name}</h2>
        <Image 
          src={employee.photo} 
          alt={employee.name} 
          width={80}
          height={80}
          className="employee-photo"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder_profile.png';
          }}
        />
      </div>

      {/* Selector + Panel de Aprobacion de horas */}
      <div className="week-controls-row">
        <div className="week-selector-column">
          <WeekSelector
            weeks={weeks}
            selectedWeek={weekKeyToUse || ''}
            onWeekChange={setSelectedWeekKey}
          />
        </div>
        
        <div className="approval-panel-column">
          <WeekApprovalPanel
            week={selectedWeek || null}
            onApprove={approveWeek}
            isCurrentWeek={isCurrentWeek}
          />
        </div>
      </div>

      {/* Grafica de horas */}
      <HoursChart
        weekData={selectedWeek || null}
        proyectosDisponibles={proyectosDisponibles}
      />

      {/* Grafica de cursos */}
      <CoursesGraphSection employee={employee} />
    </div>
  );
};