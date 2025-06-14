import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { WeekData, ProjectInfo } from '@/app/types/employee';
import '@/app/(authed)/mi_equipo/mi_equipo.css';

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

  
  const formatISODate = (isoDateString: string): string => {
    if (!isoDateString) return 'Fecha inválida';
    
    try {
      
      const dateToFormat = isoDateString.includes('T') ? isoDateString : `${isoDateString}T12:00:00`;
      const date = new Date(dateToFormat);
      
      if (isNaN(date.getTime())) {
        
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
      
      const [year, month, day] = isoDateString.split('-');
      return `${day}/${month}/${year}`;
    }
  };

  
  const generateWeekDays = () => {
    const inicioDateStr = weekData.inicio_semana;
    const days = ['Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Lunes', 'Martes'];
    
    
    const [year, month, day] = inicioDateStr.split('-').map(Number);
    
    return Array.from({ length: 7 }, (_, index) => {
      
      const currentDate = new Date(year, month - 1, day + index);
      const currentDateISO = currentDate.toISOString().split('T')[0];
      
      return {
        dayName: days[index],
        dateISO: currentDateISO,
        date: currentDate
      };
    });
  };

  
  const weekDays = generateWeekDays();
  
  const chartData: ChartDataItem[] = weekDays.map(({ dayName, dateISO }) => {
    
    const dayData = weekData.dias.find(d => d.fecha_trabajada === dateISO);
    
    const chartDay: ChartDataItem = {
      day: dayName,
      date: dateISO, 
      total: dayData?.total_horas || 0
    };

    
    if (dayData) {
      dayData.proyectos.forEach(proyecto => {
        chartDay[proyecto.id_proyecto] = proyecto.horas;
      });
    }

    return chartDay;
  });

  
  const allProjects = Array.from(
    new Set(weekData.dias.flatMap(day => 
      day.proyectos.map(p => p.id_proyecto)
    ))
  );

  
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
      
      {/* Gráfica de cursos */}
      <div className="hours-chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid stroke="#555" strokeDasharray="2 2" horizontal={true} vertical={false} />
            <XAxis dataKey="day" tick={{ fill: 'black' }} />
            <YAxis 
              domain={[0, 'dataMax + 2']}
              tickFormatter={(value: number) => `${value}h`}
              label={{ 
                value: 'Horas',
                angle: -90,
                position: 'insideLeft',
                style: {
                  textAnchor: 'middle',
                  fill: '#b9babc',
                  fontSize: 18,
                },
              }}
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
      </div>
      
      <div className="week-summary">
        <p>
          <strong>Total semana:</strong> {weekData.horas_totales}h - 
          <strong> Promedio diario:</strong> {(weekData.horas_totales / 7).toFixed(1)}h
        </p>
      </div>
    </div>
  );
};