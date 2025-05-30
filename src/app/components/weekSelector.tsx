import React from 'react';
import { WeekData } from '../types/employee';

interface WeekSelectorProps {
  weeks: WeekData[];
  selectedWeek: string;
  onWeekChange: (weekKey: string) => void;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({
  weeks, selectedWeek, onWeekChange
}) => {
  // Función para formatear el rango de la semana usando los datos de la API
  const formatWeekRange = (week: WeekData) => {
    try {
      const inicio = new Date(week.inicio_semana).toLocaleDateString('es-MX');
      const fin = new Date(week.fin_semana).toLocaleDateString('es-MX');
      return `${inicio} - ${fin}`;
    } catch (error) {
      console.error('Error formateando semana:', error);
      return 'Semana inválida';
    }
  };

  // Función para mostrar el estado de la semana
  const getWeekStatusIcon = (estado: string) => {
    switch (estado) {
      case 'aprobado': return '';
      case 'enviado': return '';
      case 'borrador': return '';
      case 'rechazado': return '';
      default: return '📅';
    }
  };

  return (
    <div className="week-selector">
      <label htmlFor="week-select">Seleccionar semana:</label>
      <select 
        id="week-select"
        value={selectedWeek} 
        onChange={(e) => onWeekChange(e.target.value)}
        className="week-select"
      >
        {weeks.map(week => (
          <option key={week.id_semana} value={week.inicio_semana}>
            {getWeekStatusIcon(week.estado)} {formatWeekRange(week)} ({week.horas_totales}h)
          </option>
        ))}
      </select>
      
      {/* Información adicional de la semana seleccionada */}
      {selectedWeek && (
        <div className="week-info">
          {(() => {
            const currentWeek = weeks.find(w => w.inicio_semana === selectedWeek);
            if (!currentWeek) return null;
            
            return (
              <div className="week-details">
                <span className="week-status">
                  Estado: <strong>{currentWeek.estado.toUpperCase()}</strong>
                </span>
                {currentWeek.enviado_el && (
                  <span className="week-submitted">
                    Enviado: {new Date(currentWeek.enviado_el).toLocaleDateString('es-MX')}
                  </span>
                )}
                {currentWeek.aprobado_el && (
                  <span className="week-approved">
                    Aprobado: {new Date(currentWeek.aprobado_el).toLocaleDateString('es-MX')}
                  </span>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};