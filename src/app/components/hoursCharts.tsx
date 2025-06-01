import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { WeekData, ProjectInfo } from '../types/employee';
import '@/app/(authed)/miequipo/EmployeeDetails.css';

interface HoursChartProps {
  weekData: WeekData | null;
  proyectosDisponibles: ProjectInfo[];
}

interface ChartDataItem {
  day: string;
  date: string;
  total: number;
  [key: string]: string | number;
}

interface TooltipPayload {
  value: number;
  dataKey: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export const HoursChart: React.FC<HoursChartProps> = ({ 
  weekData, 
  proyectosDisponibles 
}) => {
  if (!weekData) {
    return (
      <div className="hours-chart">
        <h3>Horas por día y proyecto</h3>
        <div className="no-data">
          <p>No hay datos de horas para mostrar</p>
        </div>
      </div>
    );
  }

  // FUNCION HELPER: Formatear fecha  de ISO a DD/MM/YYYY
  const formatISODate = (isoDateString: string): string => {
    if (!isoDateString) return 'Fecha inválida';
    
    try {
      // Si es solo fecha (YYYY-MM-DD) agregamos el tiempo para evitar timezone issues
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
      const [year, month, day] = isoDateString.split('-');
      return `${day}/${month}/${year}`;
    }
  };

  // Generar la semana correcta basada en las fechas reales de la API
  const generateWeekDays = () => {
    const inicioDateStr = weekData.inicio_semana; // "2025-05-28"
    const days = ['Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Lunes', 'Martes'];
    
    // Parsear la fecha de inicio
    const [year, month, day] = inicioDateStr.split('-').map(Number);
    
    return Array.from({ length: 7 }, (_, index) => {
      // Crear fecha y agregar días
      const currentDate = new Date(year, month - 1, day + index);
      const currentDateISO = currentDate.toISOString().split('T')[0];
      
      return {
        dayName: days[index],
        dateISO: currentDateISO,
        date: currentDate
      };
    });
  };

  // Crear datos para la grafica
  const weekDays = generateWeekDays();
  
  const chartData: ChartDataItem[] = weekDays.map(({ dayName, dateISO }) => {
    // Buscar datos para este dia especifico en los datos de la API
    const dayData = weekData.dias.find(d => d.fecha_trabajada === dateISO);
    
    const chartDay: ChartDataItem = {
      day: dayName,
      date: dateISO, // Guardar el ISO string
      total: dayData?.total_horas || 0
    };

    // Agregar las horas por proyecto
    if (dayData) {
      dayData.proyectos.forEach(proyecto => {
        chartDay[proyecto.id_proyecto] = proyecto.horas;
      });
    }

    return chartDay;
  });

  // Obtener todos los proyectos de esta semana
  const allProjects = Array.from(
    new Set(weekData.dias.flatMap(day => 
      day.proyectos.map(p => p.id_proyecto)
    ))
  );

  // Colores para los proyectos
  const projectColors = [
    '#4CAF50', '#2196F3', '#FFC107', '#E91E63', 
    '#9C27B0', '#009688', '#FF5722', '#795548'
  ];

  const getProjectName = (projectId: string) => {
    const proyecto = proyectosDisponibles.find(p => p.id_proyecto === projectId);
    return proyecto?.nombre || `Proyecto ${projectId.substring(0, 8)}...`;
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const day = chartData.find(d => d.day === label);
      
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">
            <strong>{label}</strong>
          </p>
          <p className="tooltip-date">
            {day?.date ? formatISODate(day.date) : ''}
          </p>
          <p className="tooltip-total">
            Total: <strong>{day?.total || 0}h</strong>
          </p>
          {payload.map((entry, index) => {
            if (entry.value > 0) {
              const projectName = getProjectName(entry.dataKey);
              return (
                <p key={index} style={{ color: entry.color }}>
                  {projectName}: <strong>{entry.value}h</strong>
                </p>
              );
            }
            return null;
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="hours-chart">
      <h3>Horas por día y proyecto</h3>
      <div className="chart-period">
        <p>
          Semana del {formatISODate(weekData.inicio_semana)} al {formatISODate(weekData.fin_semana)}
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid stroke="#555" strokeDasharray="2 2" horizontal={true} vertical={false} />
          <XAxis dataKey="day" tick={{ fill: 'black' }} />
          <YAxis 
            domain={[0, 'dataMax + 2']}
            tickFormatter={(value: number) => `${value}h`}
            label={{ value: 'Horas', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value: string) => getProjectName(value)}
          />
          
          {allProjects.map((projectId, index) => (
            <Bar
              key={projectId}
              dataKey={projectId}
              stackId="hours"
              fill={projectColors[index % projectColors.length]}
              name={projectId}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      
      <div className="week-summary">
        <p>
          <strong>Total semana:</strong> {weekData.horas_totales}h - 
          <strong> Promedio diario:</strong> {(weekData.horas_totales / 7).toFixed(1)}h
        </p>
      </div>
    </div>
  );
};