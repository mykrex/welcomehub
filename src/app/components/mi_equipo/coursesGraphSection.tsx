import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Employee } from '@/app/types/employee';
import '@/app/(authed)/mi_equipo/mi_equipo.css';

interface CoursesSectionProps {
  employee: Employee;
}

interface TooltipPayload {
  value: number;
  name: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

interface CoursesSectionProps {
  employee: Employee;
}

export const CoursesGraphSection: React.FC<CoursesSectionProps> = ({ employee }) => {
  // Verificar si las propiedades existen y tienen valores
  const normalCourses = employee.courses || { completed: 0, inProgress: 0, notStarted: 0 };
  const obligatoryCourses = employee.obligatoryCourses || { completed: 0, inProgress: 0, notStarted: 0 };

  // Datos para la grafica de cursos
  const courseGraphData = [
    {
      tipo: 'Terminados',
      normal: Math.max(0, normalCourses.completed - obligatoryCourses.completed),
      obligatorio: obligatoryCourses.completed,
    },
    {
      tipo: 'En progreso',
      normal: Math.max(0, normalCourses.inProgress - obligatoryCourses.inProgress),
      obligatorio: obligatoryCourses.inProgress,
    },
    {
      tipo: 'Sin comenzar',
      normal: Math.max(0, normalCourses.notStarted - obligatoryCourses.notStarted),
      obligatorio: obligatoryCourses.notStarted,
    },
  ];

  console.log('Datos finales para la grafica:', courseGraphData);

  // Tooltip personalizado para mantener consistencia con el tema
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">
            <strong>{label}</strong>
          </p>
          {payload.map((entry, index) => {
            if (entry.value > 0) {
              return (
                <p key={index} style={{ color: entry.color }}>
                  {entry.name}: <strong>{entry.value} cursos</strong>
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
    <div className="courses-section">
      <div className="courses-header">
        <h3>Progreso de Cursos</h3>
        <p>Avance en los cursos obligatorios y opcionales</p>
      </div>

      {/* Gráfica de cursos */}
      <div className="courses-chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={courseGraphData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              stroke="#e4e7ef" 
              strokeDasharray="2 2" 
              horizontal={true} 
              vertical={false} 
            />
            <XAxis
              dataKey="tipo"
              tick={{ fill: '#8b949e', fontSize: 12 }}
              axisLine={{ stroke: '#e4e7ef' }}
              tickLine={{ stroke: '#e4e7ef' }}
            />
            <YAxis
              tick={{ fill: '#8b949e', fontSize: 12 }}
              axisLine={{ stroke: '#e4e7ef' }}
              tickLine={{ stroke: '#e4e7ef' }}
              allowDecimals={false}
              label={{
                value: 'Cantidad de Cursos',
                angle: -90,
                position: 'insideLeft',
                style: {
                  textAnchor: 'middle',
                  fill: '#b9babc',
                  fontSize: 16,
                },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                color: '#e1e4e8',
                fontSize: '14px'
              }}
            />
            <Bar 
              dataKey="obligatorio" 
              stackId="courses" 
              fill="#f7931e" 
              name="Obligatorios"
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="normal" 
              stackId="courses" 
              fill="#58a6ff" 
              name="Opcionales"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Estadísticas de cursos */}
      <div className="course-stats">
        <div className="course-summary">
          <h4>Resumen Total</h4>
          <div className="stats-grid">
            <div className="stat-item completed">
              <div className="stat-info">
                <span className="stat-number">{normalCourses.completed}</span>
                <span className="stat-label">Terminados</span>
              </div>
            </div>
            <div className="stat-item in-progress">
              <div className="stat-info">
                <span className="stat-number">{normalCourses.inProgress}</span>
                <span className="stat-label">En proceso</span>
              </div>
            </div>
            <div className="stat-item not-started">
              <div className="stat-info">
                <span className="stat-number">{normalCourses.notStarted}</span>
                <span className="stat-label">Sin comenzar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detalle de cursos obligatorios */}
        <div className="mandatory-courses-detail">
          <h4>Cursos Obligatorios</h4>
          <div className="mandatory-stats">
            <div className="mandatory-item">
              <span>Completados: </span>
              <strong>{obligatoryCourses.completed}</strong>
            </div>
            <div className="mandatory-item">
              <span>En progreso: </span>
              <strong>{obligatoryCourses.inProgress}</strong>
            </div>
            <div className="mandatory-item">
              <span>Pendientes: </span>
              <strong>{obligatoryCourses.notStarted}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};