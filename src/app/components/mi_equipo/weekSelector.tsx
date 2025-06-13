import React from 'react';
import { WeekData } from '../../types/employee';

interface WeekSelectorProps {
  weeks: WeekData[];
  selectedWeek: string;
  onWeekChange: (weekKey: string) => void;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({
  weeks, selectedWeek, onWeekChange
}) => {
  // FUNCION HELPER para ormatear fecha ISO a DD/MM/YYYY
  const formatISODate = (isoDateString: string): string => {
    if (!isoDateString) return 'Fecha inválida';
    
    try {
      // Si es solo fecha (YYYY-MM-DD) se agrega tiempo para evitar timezone issues
      const dateToFormat = isoDateString.includes('T') ? isoDateString : `${isoDateString}T12:00:00`;
      const date = new Date(dateToFormat);
      
      if (isNaN(date.getTime())) {
        // Fallback parsing manual
        const [year, month, day] = isoDateString.split('-');
        return `${day}/${month}/${year}`;
      }
      
      return date.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formateando fecha:', isoDateString, error);
      return 'Fecha inválida';
    }
  };

  // Funcion para formatear el rango de la semana
  const formatWeekRange = (week: WeekData) => {
    const inicio = formatISODate(week.inicio_semana);
    const fin = formatISODate(week.fin_semana);
    return `${inicio} - ${fin}`;
  };

  // Funcion para mostrar el estado de la semana
  const getWeekStatusIcon = (estado: string) => {
    switch (estado) {
      case 'aprobado': return '✔';
      case 'enviado': return '';
      case 'borrador': return '';
      case 'rechazado': return 'x';
      default: return '-';
    }
  };

  // Ordenar semanas por fecha de inicio (la mas reciente va primero)
  const sortedWeeks = [...weeks].sort((a, b) => {
    const dateA = new Date(a.inicio_semana);
    const dateB = new Date(b.inicio_semana);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="week-selector">
      <label htmlFor="week-select">Seleccionar semana:</label>
      <select 
        id="week-select"
        value={selectedWeek} 
        onChange={(e) => onWeekChange(e.target.value)}
        className="week-select"
      >
        {sortedWeeks.map(week => (
          <option key={week.id_semana} value={week.inicio_semana}>
            {getWeekStatusIcon(week.estado)} {formatWeekRange(week)} ({week.horas_totales}h)
          </option>
        ))}
      </select>
      
      {/* Informacion adicional de la semana seleccionada */}
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
                    Enviado: {formatISODate(currentWeek.enviado_el)}
                  </span>
                )}
                {currentWeek.aprobado_el && (
                  <span className="week-approved">
                    Aprobado: {formatISODate(currentWeek.aprobado_el)}
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