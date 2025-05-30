import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Employee } from '../types/employee';
import '@/app/(authed)/miequipo/EmployeeDetails.css';

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
  // DEBUG: Mostrar datos completos del empleado
  console.log('🔍 DEBUG - Datos completos del empleado:', JSON.stringify(employee, null, 2));
  console.log('📚 DEBUG - Cursos normales:', employee.courses);
  console.log('🎓 DEBUG - Cursos obligatorios:', employee.obligatoryCourses);

  // Verificar si las propiedades existen y tienen valores
  const normalCourses = employee.courses || { completed: 0, inProgress: 0, notStarted: 0 };
  const obligatoryCourses = employee.obligatoryCourses || { completed: 0, inProgress: 0, notStarted: 0 };

  // DEBUG: Mostrar valores calculados
  console.log('📊 DEBUG - Calculando datos para gráfica:');
  console.log('- Terminados normales:', normalCourses.completed - obligatoryCourses.completed);
  console.log('- Terminados obligatorios:', obligatoryCourses.completed);
  console.log('- En proceso normales:', normalCourses.inProgress - obligatoryCourses.inProgress);
  console.log('- En proceso obligatorios:', obligatoryCourses.inProgress);
  console.log('- Sin empezar normales:', normalCourses.notStarted - obligatoryCourses.notStarted);
  console.log('- Sin empezar obligatorios:', obligatoryCourses.notStarted);

  // Datos para la gráfica de cursos
  const courseGraphData = [
    {
      tipo: 'Terminados',
      normal: Math.max(0, normalCourses.completed - obligatoryCourses.completed),
      obligatorio: obligatoryCourses.completed,
    },
    {
      tipo: 'En proceso',
      normal: Math.max(0, normalCourses.inProgress - obligatoryCourses.inProgress),
      obligatorio: obligatoryCourses.inProgress,
    },
    {
      tipo: 'Sin empezar',
      normal: Math.max(0, normalCourses.notStarted - obligatoryCourses.notStarted),
      obligatorio: obligatoryCourses.notStarted,
    },
  ];

  console.log('📈 DEBUG - Datos finales para gráfica:', courseGraphData);

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
        <p>Distribución de cursos obligatorios y normales</p>
      </div>

      {/* DEBUG PANEL - Remover en producción */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          background: '#1c2128', 
          border: '1px solid #30363d',
          borderRadius: '8px',
          padding: '1rem', 
          margin: '1rem 0',
          fontSize: '12px',
          fontFamily: 'monospace',
          color: '#e1e4e8'
        }}>
          <details>
            <summary style={{ cursor: 'pointer', color: '#58a6ff' }}>
              🐛 DEBUG: Datos de Cursos
            </summary>
            <div style={{ marginTop: '0.5rem' }}>
              <h4 style={{ color: '#f6f8fa', margin: '0.5rem 0' }}>Datos Raw:</h4>
              <pre style={{ background: '#0d1117', padding: '0.5rem', borderRadius: '4px', overflow: 'auto' }}>
                {JSON.stringify({ 
                  courses: employee.courses, 
                  obligatoryCourses: employee.obligatoryCourses,
                  graphData: courseGraphData 
                }, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      )}

      {/* Gráfica de cursos */}
      <div className="courses-chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={courseGraphData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              stroke="#30363d" 
              strokeDasharray="2 2" 
              horizontal={true} 
              vertical={false} 
            />
            <XAxis
              dataKey="tipo"
              tick={{ fill: '#8b949e', fontSize: 12 }}
              axisLine={{ stroke: '#30363d' }}
              tickLine={{ stroke: '#30363d' }}
            />
            <YAxis
              tick={{ fill: '#8b949e', fontSize: 12 }}
              axisLine={{ stroke: '#30363d' }}
              tickLine={{ stroke: '#30363d' }}
              allowDecimals={false}
              label={{
                value: 'Cantidad de Cursos',
                angle: -90,
                position: 'insideLeft',
                style: {
                  textAnchor: 'middle',
                  fill: '#8b949e',
                  fontSize: 12,
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
              name="Normales"
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
              <span className="stat-icon">✅</span>
              <div className="stat-info">
                <span className="stat-number">{normalCourses.completed}</span>
                <span className="stat-label">Terminados</span>
              </div>
            </div>
            <div className="stat-item in-progress">
              <span className="stat-icon">⏳</span>
              <div className="stat-info">
                <span className="stat-number">{normalCourses.inProgress}</span>
                <span className="stat-label">En proceso</span>
              </div>
            </div>
            <div className="stat-item not-started">
              <span className="stat-icon">⚠️</span>
              <div className="stat-info">
                <span className="stat-number">{normalCourses.notStarted}</span>
                <span className="stat-label">Sin empezar</span>
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
              <span>En proceso: </span>
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