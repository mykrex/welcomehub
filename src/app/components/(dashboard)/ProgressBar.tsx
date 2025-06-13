// src/app/(authed)/dashboard/assets/ProgressBar.jsx
import '@/app/(authed)/dashboard/dashboard.css'

import { CursoInscrito } from '@/app/hooks/useCourses';

interface ProgressComponentProps {
  cursos: CursoInscrito[];
}

export default function ProgressComponent({ cursos = [] }: ProgressComponentProps) {
  // Calcular estadísticas de los cursos
  const totalCursos = cursos.length;
  const cursosCompletados = cursos.filter(curso => curso.estado === 'completado').length;
  
  // Calcular porcentajes
  const porcentajeCompletado = totalCursos > 0 ? Math.round((cursosCompletados / totalCursos) * 100) : 0;
  const porcentajeRestante = 100 - porcentajeCompletado;
  
  // Si no hay cursos, mostrar mensaje alternativo
  if (totalCursos === 0) {
    return (
      <div className="db-progress-container">
        <div className="db-progress-title-container">
          <div className="db-progress-title-main">Progreso Total</div>
          <div className="db-progress-stats">
            No hay cursos inscritos
          </div>
        </div>
        <div className="db-progress-bar-group">
          <div className="db-progress-bar-total" />
          <div className="db-progress-bar-completed" style={{ width: '0%' }} />
        </div>
        <div className="db-progress-summary">
          <div className="db-progress-item">
            <div className="db-progress-item-circle circle-completado" />
            <div className="db-progress-item-label">0% Completado</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="db-progress-container">
      {/* Title */}
      <div className="db-progress-title-container">
        <div className="db-progress-title-main">Progreso Total</div>
      </div>

      {/* Progress Bar */}
      <div className="db-progress-bar-group">
        {/* Bars */}
        {/* Progress Bar Total -> 100% */}
        <div className="db-progress-bar-total" />
        {/* Progress Bar Completed -> variable */}
        <div 
          className="db-progress-bar-completed" 
          style={{ width: `${porcentajeCompletado}%` }}
        />
      </div>

      <div className="db-progress-summary">
        <div className="db-progress-item">
          <div className="db-progress-item-circle circle-completado" />
          <div className="db-progress-item-label">
            {porcentajeCompletado}% Completado
          </div>
        </div>
        {porcentajeRestante > 0 && (
          <div className="db-progress-item">
            <div className="db-progress-item-circle circle-restante" />
            <div className="db-progress-item-label">
              {porcentajeRestante}% Restante
            </div>
          </div>
        )}
      </div>
    </div>
  );
}