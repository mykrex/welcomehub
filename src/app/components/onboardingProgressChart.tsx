import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Employee } from '../types/employee';

interface OnboardingProgressChartProps {
  employees: Employee[];
  teamName: string;
  onSegmentClick?: (employees: Employee[], title: string, subtitle: string) => void;
}

interface EmployeeStatus {
  employee: Employee;
  isComplete: boolean;
  completedCourses: number;
  totalRequired: number;
}

interface ChartData {
  name: string;
  value: number;
  count: number;
  employees: Employee[];
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ChartData;
  }>;
}

export const OnboardingProgressChart: React.FC<OnboardingProgressChartProps> = ({
  employees,
  teamName,
  onSegmentClick
}) => {
  // Calcular el estado de onboarding para cada empleado
  const employeeStatuses = useMemo((): EmployeeStatus[] => {
    return employees.map(employee => {
      const completedCourses = employee.obligatoryCourses.completed;
      const totalRequired = 6; // 6 cursos obligatorios 
      const isComplete = completedCourses >= totalRequired;

      return {
        employee,
        isComplete,
        completedCourses,
        totalRequired
      };
    });
  }, [employees]);

  // Preparar datos para la grafica
  const chartData = useMemo((): ChartData[] => {
    const completed = employeeStatuses.filter(status => status.isComplete);
    const inProgress = employeeStatuses.filter(status => !status.isComplete);
    const total = employees.length;

    return [
      {
        name: 'Onboarding Completado',
        value: total > 0 ? Math.round((completed.length / total) * 100) : 0,
        count: completed.length,
        employees: completed.map(status => status.employee),
        color: '#4CAF50'
      },
      {
        name: 'En Progreso',
        value: total > 0 ? Math.round((inProgress.length / total) * 100) : 0,
        count: inProgress.length,
        employees: inProgress.map(status => status.employee),
        color: '#FF9800'
      }
    ].filter(item => item.count > 0); // Filtrar los segmentos vacios
  }, [employeeStatuses, employees.length]);

  const handleSegmentClick = (data: ChartData) => {
    if (onSegmentClick) {
      const subtitle = `${data.count} empleados (${data.value}%)`;
      onSegmentClick(data.employees, data.name, subtitle);
    }
  };

  const handleCardClick = (data: ChartData) => {
    if (onSegmentClick) {
      const subtitle = `${data.count} empleados (${data.value}%)`;
      onSegmentClick(data.employees, data.name, subtitle);
    }
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-1">{data.name}</p>
          <p className="text-gray-300">{data.count} empleados ({data.value}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#263345] rounded-xl p-8 m-8 text-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Progreso de Onboarding - {teamName}
        </h3>
        <p className="text-gray-400 mb-4">
          Estado de los cursos obligatorios por empleado
        </p>
      </div>

      {/* Grafica de pastel */}
      <div className="bg-gray-700 rounded-lg p-6 mb-8">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                paddingAngle={2}
                dataKey="value"
                onClick={handleSegmentClick}
                className="cursor-pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                formatter={(value, entry) => {
                  const data = entry.payload as unknown as ChartData;
                  return `${value}: ${data.count} empleados (${data.value}%)`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No hay datos de empleados para mostrar</p>
          </div>
        )}
      </div>

      {/* Segmentos de la grafica de pastel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chartData.map((data, index) => (
          <div 
            key={index}
            className={`bg-gray-700 rounded-lg p-6 border-l-4 transition-all duration-300 cursor-pointer hover:bg-gray-600 hover:transform hover:-translate-y-1 hover:shadow-lg ${
              data.name.toLowerCase().includes('completado') 
                ? 'border-green-500' 
                : 'border-orange-500'
            }`}
            onClick={() => handleCardClick(data)}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-semibold">{data.name}</h4>
              <span className="text-3xl font-bold text-blue-400">{data.value}%</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-white">{data.count}</span>
              <span className="text-gray-400">empleados</span>
            </div>
            <p className="text-gray-400 text-sm">
              Click para ver lista detallada →
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};