import '@/app/(authed)/dashboard/dashboard.css'

import { GraduationCap } from "lucide-react";
import { CursoInscrito } from '@/app/hooks/useCourses';

interface OnboardingStatsProps {
  cursos: CursoInscrito[];
}

export default function OnboardingStats({ cursos = [] }: OnboardingStatsProps) {
  // Filtrar solo cursos obligatorios
  const cursosObligatorios = cursos.filter(curso => curso.obligatorio === true);
  const totalObligatorios = cursosObligatorios.length;
  const obligatoriosCompletados = cursosObligatorios.filter(curso => curso.estado === 'completado').length;
  
  // Calcular porcentaje
  const porcentajeCompletado = totalObligatorios > 0 ? Math.round((obligatoriosCompletados / totalObligatorios) * 100) : 0;
  
  return (
    <div className="average-stats-card">
      <div className="ac-content">
        <div className="ac-title">Progreso Onboarding</div>

        <div className="average-stats-main-score flex flex-col items-center justify-center">
          <div className="flex items-baseline justify-items-center items-center">
            <span className="average-stats-number">{porcentajeCompletado}</span>
            <span className="average-stats-unit">%</span>
            <GraduationCap className="average-stats-icon ml-8" />
          </div>
        </div>

        <div className="average-stats-comparison">
          <span className="gray">
            {obligatoriosCompletados} de {totalObligatorios} cursos completados
          </span>
        </div>
      </div>
    </div>
  );
}