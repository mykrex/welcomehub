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
          <p><strong>Enviado:</strong> {new Date(week.enviado_el).toLocaleDateString('es-MX')}</p>
        )}
        
        {week.aprobado_el && (
          <p><strong>Aprobado:</strong> {new Date(week.aprobado_el).toLocaleDateString('es-MX')}</p>
        )}
        
        <p><strong>Horas totales:</strong> {week.horas_totales}h</p>
      </div>

      {canApprove && (
        <button 
          className="approve-button"
          onClick={handleApprove}
          disabled={approving}
        >
          {approving ? 'Aprobando...' : 'Aprobar Semana'}
        </button>
      )}

      {isApproved && (
        <div className="approved-badge">
          ✅ Semana Aprobada
        </div>
      )}

      {!isCurrentWeek && week.estado !== 'aprobado' && (
        <div className="info-badge">
          ℹ️ Solo se pueden aprobar semanas actuales
        </div>
      )}
    </div>
  );
};