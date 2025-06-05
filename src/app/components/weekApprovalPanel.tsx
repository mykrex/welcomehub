import { useState } from "react";
import { WeekData } from "../types/employee";

interface WeekApprovalPanelProps {
  week: WeekData | null;
  onApprove: (weekId: number) => Promise<boolean>;
  isCurrentWeek: boolean;
}

export const WeekApprovalPanel: React.FC<WeekApprovalPanelProps> = ({
  week, onApprove, isCurrentWeek
}) => {
  const [approving, setApproving] = useState(false);

  // FUNCION HELPER: Formatear fecha de ISO a DD/MM/YYYY
  const formatISODate = (isoDateString: string): string => {
    if (!isoDateString) return 'Fecha inválida';
    
    try {
      // Si es solo fecha (YYYY-MM-DD) agregar el tiempo para evitar timezone issues
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
      // Fallback manual
      if (isoDateString.includes('-')) {
        const [year, month, day] = isoDateString.split('-');
        return `${day}/${month}/${year}`;
      }
      return 'Fecha inválida';
    }
  };

  const handleApprove = async () => {
    if (!week) return;
    
    setApproving(true);
    try {
      await onApprove(week.id_semana);
    } catch (error) {
      console.error('Error aprobando semana:', error);
    } finally {
      setApproving(false);
    }
  };

  if (!week) return null;

  const canApprove = week.estado === 'enviado' && isCurrentWeek;
  const isApproved = week.estado === 'aprobado';

  return (
    <div className="approval-panel">
      <div className="week-status">
        <h4>Estado de la semana</h4>
        <p>
          <strong>Estado:</strong> 
          <span className={`status-badge status-${week.estado}`}>
            {week.estado.toUpperCase()}
          </span>
        </p>
        
        {week.enviado_el && (
          <p>
            <strong>Enviado:</strong> {formatISODate(week.enviado_el)}
          </p>
        )}
        
        {week.aprobado_el && (
          <p>
            <strong>Aprobado:</strong> {formatISODate(week.aprobado_el)}
          </p>
        )}
        
        <p><strong>Horas totales:</strong> {week.horas_totales}h</p>
      </div>

      {canApprove && (
        <button 
          className="approve-button ml-4"
          onClick={handleApprove}
          disabled={approving}
        >
          {approving ? 'Aprobando...' : 'Aprobar Semana'}
        </button>
      )}

      {isApproved && (
        <div className="approved-badge">
          ✔ Semana Aprobada
        </div>
      )}

      {!isCurrentWeek && week.estado !== 'aprobado' && (
        <div className="info-badge">
          ℹ Solo se pueden aprobar semanas actuales
        </div>
      )}
    </div>
  );
};