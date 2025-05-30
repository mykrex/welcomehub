// hooks/useEmployeeWeeks.ts - Versión corregida para usar tu estructura de API

import { useState, useEffect, useCallback } from 'react';
import { WeekData, ProjectInfo } from '../types/employee';

interface UseEmployeeWeeksReturn {
  weeks: WeekData[];
  proyectosDisponibles: ProjectInfo[];
  loading: boolean;
  error: string | null;
  approveWeek: (weekId: number) => Promise<boolean>;
}

export function useEmployeeWeeks(employeeId: string): UseEmployeeWeeksReturn { // Cambiado a string
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [proyectosDisponibles, setProyectosDisponibles] = useState<ProjectInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Usar useCallback para evitar recrear la función en cada render
  const fetchWeeks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar tu estructura de API existente
      const response = await fetch(`/api/miequipo/employee_weeks?employeeId=${employeeId}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setWeeks(data.weeks || []);
      setProyectosDisponibles(data.proyectosDisponibles || []);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching employee weeks:', err);
    } finally {
      setLoading(false);
    }
  }, [employeeId]); // Dependencia de employeeId

  const approveWeek = useCallback(async (weekId: number): Promise<boolean> => {
    try {
      // Usar tu estructura de API existente
      const response = await fetch('/api/miequipo/approve_week', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId,
          weekId
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Refrescar datos después de aprobar
      await fetchWeeks();
      return true;
      
    } catch (err) {
      console.error('Error aprobando semana:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error aprobando semana';
      setError(errorMessage);
      return false;
    }
  }, [employeeId, fetchWeeks]);

  useEffect(() => {
    if (employeeId) {
      fetchWeeks();
    }
  }, [employeeId, fetchWeeks]); // Ahora fetchWeeks está en las dependencias

  return {
    weeks,
    proyectosDisponibles,
    loading,
    error,
    approveWeek,
  };
}