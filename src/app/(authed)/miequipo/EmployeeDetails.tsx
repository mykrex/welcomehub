'use client';

import React from 'react';
import './AdminPanel.css';
import { EmpleadoNuevo } from '@/pages/api/miequipo/fakefetch';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface Props {
  employee: EmpleadoNuevo;
  selectedWeek: string;
  deliveryDates: { [week: string]: { [id: number]: string | null } };
  setDeliveryDates: React.Dispatch<React.SetStateAction<{ [week: string]: { [id: number]: string | null } }>>;
  approvalDates: { [week: string]: { [id: number]: string | null } };
  setApprovalDates: React.Dispatch<React.SetStateAction<{ [week: string]: { [id: number]: string | null } }>>;
}

interface ChartDay {
  day: string;
  [key: string]: number | string; // si luego agregas datos por proyecto
}

const dayLabels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const projectColorPalette = ['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0', '#009688', '#FF5722', '#795548'];
const projectColorMap: { [project: string]: string } = {};

function getProjectColor(project: string) {
  if (!projectColorMap[project]) {
    const used = Object.keys(projectColorMap).length;
    projectColorMap[project] = projectColorPalette[used % projectColorPalette.length];
  }
  return projectColorMap[project];
}

function persistToStorage(key: string, data: unknown): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export default function EmployeeDetails({
  employee,
  selectedWeek,
  deliveryDates,
  setDeliveryDates,
  approvalDates,
  setApprovalDates,
}: Props) {
  const delivery = deliveryDates[selectedWeek]?.[employee.id] || null;
  const approval = approvalDates[selectedWeek]?.[employee.id] || null;

  const toggleAssignment = () => {
    setDeliveryDates((prev) => {
      const prevWeek = prev[selectedWeek] || {};
      const updatedWeek = {
        ...prevWeek,
        [employee.id]: prevWeek[employee.id] ? null : new Date().toLocaleDateString('es-MX'),
      };

      const updated = {
        ...prev,
        [selectedWeek]: updatedWeek,
      };

      persistToStorage('deliveryDates', updated);
      return updated;
    });
  };

  const toggleApproval = () => {
    setApprovalDates((prev) => {
      const prevWeek = prev[selectedWeek] || {};
      const updatedWeek = {
        ...prevWeek,
        [employee.id]: prevWeek[employee.id] ? null : new Date().toLocaleDateString('es-MX'),
      };

      const updated = {
        ...prev,
        [selectedWeek]: updatedWeek,
      };

      persistToStorage('approvalDates', updated);
      return updated;
    });
  };

  // === GRÁFICA DE HORAS POR PROYECTO ===
  const chartData: ChartDay[] = Array.from({ length: 7 }, (_, i) => ({
    day: dayLabels[i],
  }));

  Object.entries(employee.projectsPerDay).forEach(([isoDate, projects]) => {
    const date = new Date(isoDate);
    const start = new Date(selectedWeek);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    if (date >= start && date <= end) {
      const dayIndex = date.getDay();
      projects.forEach((p) => {
        const d = chartData[dayIndex];
        const current = typeof d[p.project] === 'number' ? d[p.project] as number : 0;
        d[p.project] = current + p.hours;
      });
    }
  });

  const allProjects = Array.from(
    new Set(chartData.flatMap(day => Object.keys(day).filter(k => k !== 'day')))
  );

  const totalHours = chartData.reduce((sum, day) =>
    sum + allProjects.reduce((acc, proj) => acc + (typeof day[proj] === 'number' ? day[proj] : 0), 0)
    , 0);

  const avgHours = (totalHours / 7).toFixed(1);

  // === DATOS PARA LA GRÁFICA DE CURSOS ===
  const courseGraphData = [
    {
      tipo: 'Terminados',
      normal: employee.courses.completed - employee.obligatoryCourses.completed,
      obligatorio: employee.obligatoryCourses.completed,
    },
    {
      tipo: 'En proceso',
      normal: employee.courses.inProgress - employee.obligatoryCourses.inProgress,
      obligatorio: employee.obligatoryCourses.inProgress,
    },
    {
      tipo: 'Sin empezar',
      normal: employee.courses.notStarted - employee.obligatoryCourses.notStarted,
      obligatorio: employee.obligatoryCourses.notStarted,
    },
  ];

  return (
    <div className="employee-details">
      <div className="employee-header">
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Gráfica de horas por proyecto</h3>
        </div>
        <div className="assignment-panel">
          <button className="assignment-button" onClick={toggleAssignment}>
            {delivery ? 'Quitar asignación' : 'Asignar'}
          </button>
          <button
            className="assignment-button"
            onClick={toggleApproval}
            disabled={!delivery}
            title={!delivery ? 'Primero debe asignarse una entrega' : ''}
          >
            {approval ? 'Quitar aprobación' : 'Aprobar'}
          </button>
          <div className="assignment-dates">
            <p>📅 Entrega: <strong>{delivery || 'N/A'}</strong></p>
            <p>✅ Aprobación: <strong>{approval || 'N/A'}</strong></p>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
            barCategoryGap={20}
            barGap={4}
          >
            <CartesianGrid stroke="#555" strokeDasharray="2 2" horizontal={true} vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: 'black' }}
              axisLine={{ stroke: 'black' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 12]}
              interval={0}
              tickCount={13}
              tickFormatter={(value) => `${value} h`}
              axisLine={{ stroke: 'black' }}
              tick={{ fill: 'black', fontWeight: 'bold' }}
              label={{
                value: 'Horas',
                angle: -90,
                position: 'insideLeft',
                style: {
                  textAnchor: 'middle',
                  fill: 'black',
                  fontSize: 13,
                  fontWeight: 'bold',
                },
              }}
            />
            <Tooltip />
            <Legend />
            {allProjects.map((proj) => (
              <Bar
                key={proj}
                dataKey={proj}
                stackId="a"
                fill={getProjectColor(proj)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="summary">
        <p><strong>Horas totales:</strong> {totalHours} horas — <strong>Promedio diario:</strong> {avgHours} horas</p>
      </div>

      <h4 className="titleofcourses">Cursos:</h4>

      {/* NUEVA GRÁFICA DE CURSOS */}
      <div className="chart-container" style={{ marginTop: '20px' }}>
        <h4 style={{ color: 'black', textAlign: 'center', marginBottom: '10px' }}>Distribución de Cursos (Obligatorios resaltados)</h4>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={courseGraphData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid stroke="#555" strokeDasharray="1 1" horizontal={true} vertical={false} />
            <XAxis
              dataKey="tipo"
              tick={{ fill: 'black' }}
              axisLine={{ stroke: 'black' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'black', fontWeight: 'bold', fontSize: 13 }}
              axisLine={{ stroke: 'black' }}
              allowDecimals={false}
              tickCount={8} // fuerza a mostrar 8 valores aunque sean 0 a 7
              label={{
                value: 'Cantidad',
                angle: -90,
                position: 'insideLeft',
                style: {
                  textAnchor: 'middle',
                  fill: 'black',
                  fontSize: 13,
                  fontWeight: 'bold',
                },
              }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="obligatorio" stackId="a" fill="#FF9800" name="Obligatorios" />
            <Bar dataKey="normal" stackId="a" fill="#2196F3" name="Normales" />
          </BarChart>
        </ResponsiveContainer>

      </div>

      <div className="course-stats">
        <ul>
          <li>✅ Terminados: {employee.courses.completed}</li>
          <li>⏳ En proceso: {employee.courses.inProgress}</li>
          <li>⚠️ Sin empezar: {employee.courses.notStarted}</li>
        </ul>
      </div>


    </div>
  );
}



/*'use client';

import React from 'react';
import './AdminPanel.css';
import { EmpleadoNuevo } from '@/pages/api/miequipo/fakefetch';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface Props {
  employee: EmpleadoNuevo;
  selectedWeek: string;
  deliveryDates: { [week: string]: { [id: number]: string | null } };
  setDeliveryDates: React.Dispatch<React.SetStateAction<{ [week: string]: { [id: number]: string | null } }>>;
  approvalDates: { [week: string]: { [id: number]: string | null } };
  setApprovalDates: React.Dispatch<React.SetStateAction<{ [week: string]: { [id: number]: string | null } }>>;
}

const dayLabels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const projectColorPalette = ['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0', '#009688', '#FF5722', '#795548'];
const projectColorMap: { [project: string]: string } = {};

function getProjectColor(project: string) {
  if (!projectColorMap[project]) {
    const used = Object.keys(projectColorMap).length;
    projectColorMap[project] = projectColorPalette[used % projectColorPalette.length];
  }
  return projectColorMap[project];
}

function persistToStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export default function EmployeeDetails({
  employee,
  selectedWeek,
  deliveryDates,
  setDeliveryDates,
  approvalDates,
  setApprovalDates,
}: Props) {
  const delivery = deliveryDates[selectedWeek]?.[employee.id] || null;
  const approval = approvalDates[selectedWeek]?.[employee.id] || null;

  const toggleAssignment = () => {
    setDeliveryDates((prev) => {
      const prevWeek = prev[selectedWeek] || {};
      const updatedWeek = {
        ...prevWeek,
        [employee.id]: prevWeek[employee.id] ? null : new Date().toLocaleDateString('es-MX'),
      };

      const updated = {
        ...prev,
        [selectedWeek]: updatedWeek,
      };

      persistToStorage('deliveryDates', updated);
      return updated;
    });
  };

  const toggleApproval = () => {
    setApprovalDates((prev) => {
      const prevWeek = prev[selectedWeek] || {};
      const updatedWeek = {
        ...prevWeek,
        [employee.id]: prevWeek[employee.id] ? null : new Date().toLocaleDateString('es-MX'),
      };

      const updated = {
        ...prev,
        [selectedWeek]: updatedWeek,
      };

      persistToStorage('approvalDates', updated);
      return updated;
    });
  };

  // Convert projectsPerDay a formato Recharts
  const chartData: any[] = Array.from({ length: 7 }, (_, i) => ({
    day: dayLabels[i],
  }));

  Object.entries(employee.projectsPerDay).forEach(([isoDate, projects]) => {
    const date = new Date(isoDate);
    const start = new Date(selectedWeek);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    if (date >= start && date <= end) {
      const dayIndex = date.getDay();
      projects.forEach((p) => {
        const d = chartData[dayIndex];
        d[p.project] = (d[p.project] || 0) + p.hours;
      });
    }
  });

  const allProjects = Array.from(
    new Set(chartData.flatMap(day => Object.keys(day).filter(k => k !== 'day')))
  );

  const totalHours = chartData.reduce((sum, day) =>
    sum + allProjects.reduce((acc, proj) => acc + (day[proj] || 0), 0)
  , 0);

  const avgHours = (totalHours / 7).toFixed(1);

  return (
    <div className="employee-details">
      <div className="employee-header">
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Gráfica de horas por proyecto</h3>
        </div>
        <div className="assignment-panel">
          <button className="assignment-button" onClick={toggleAssignment}>
            {delivery ? 'Quitar asignación' : 'Asignar'}
          </button>
          <button
            className="assignment-button"
            onClick={toggleApproval}
            disabled={!delivery}
            title={!delivery ? 'Primero debe asignarse una entrega' : ''}
          >
            {approval ? 'Quitar aprobación' : 'Aprobar'}
          </button>
          <div className="assignment-dates">
            <p>📅 Entrega: <strong>{delivery || 'N/A'}</strong></p>
            <p>✅ Aprobación: <strong>{approval || 'N/A'}</strong></p>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid stroke="#555" strokeDasharray="2 2" horizontal={true} vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: 'black' }}
              axisLine={{ stroke: 'black' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 12]}
              interval={0}
              tickCount={13}
              tickFormatter={(value) => `${value} h`}
              axisLine={{ stroke: 'black' }}
              tick={{ fill: 'black', fontWeight: 'bold' }}
              label={{
                value: 'Horas',
                angle: -90,
                position: 'insideLeft',
                style: {
                  textAnchor: 'middle',
                  fill: 'black',
                  fontSize: 13,
                  fontWeight: 'bold',
                },
              }}
            />
            <Tooltip />
            <Legend />
            {allProjects.map((proj) => (
              <Bar
                key={proj}
                dataKey={proj}
                stackId="a"
                fill={getProjectColor(proj)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="summary">
        <p><strong>Horas totales:</strong> {totalHours} horas — <strong>Promedio diario:</strong> {avgHours} horas</p>
      </div>

      <div className="course-stats">
        <h4 className="titleofcourses">Cursos:</h4>
        <ul>
          <li>✅ Terminados: {employee.courses?.completed ?? 0}</li>
          <li>⏳ En proceso: {employee.courses?.inProgress ?? 0}</li>
          <li>❌ Incompletos: {employee.courses?.incomplete ?? 0}</li>
          <li>⚠️ Sin empezar: {employee.courses?.notStarted ?? 0}</li>
        </ul>
      </div>
    </div>
  );
}
*/

/*'use client';

import React from 'react';
import './AdminPanel.css';

import { Empleado } from '@/pages/api/miequipo/fetchequipo';

interface Props {
  employee: Empleado;
}

const dayLabels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const MAX_HOURS = 13;

export default function EmployeeDetails({ employee }: Props) {
  const totalHours = employee.hoursPerDay.reduce((acc, val) => acc + val, 0);
  const avgHours = (totalHours / 7).toFixed(1);

  return (
    <div className="employee-details">
      <div className="employee-header">
        <h3>Gráfica de horas de la semana</h3>
      </div>

      <div className="chart-grid">

  <div className="grid-lines-overlay">
  {Array.from({ length: MAX_HOURS + 1 }, (_, i) => {
  const val = i - 1; // Hides -1 
  const isHidden = i === 0;

  return (
    <div key={i} className="grid-line-row">
      <span className={`y-label ${isHidden ? 'invisible' : ''}`}>
        {isHidden ? '' : val}
      </span>
      <div className={`grid-line ${isHidden ? 'invisible' : ''}`} />
    </div>
  );
}).reverse()}
    <span className="axis-y-title">horas</span>
  </div>

  {/*Bars*
  <div className="bars-area">
    {employee.hoursPerDay.map((val, i) => (
      <div key={i} className="bar-column">
        <div
          className="bar"
          style={{ height: `${(val / MAX_HOURS) * 100}%` }}
        />
        <span className="x-label">{dayLabels[i]}</span>
      </div>
    ))}
  </div>
</div>

      <p style={{ textAlign: 'center' }}>
        <strong>Horas totales:</strong> {totalHours} horas — <strong>Promedio diario:</strong> {avgHours} horas
      </p>

      <div className="course-stats">
        <h4 className="titleofcourses">Cursos:</h4>
        <ul>
          <li>✅ Terminados: {employee.courses.completed}</li>
          <li>⏳ En proceso: {employee.courses.inProgress}</li>
          <li>❌ Incompletos: {employee.courses.incomplete}</li>
          <li>⚠️ Sin empezar: {employee.courses.notStarted}</li>
        </ul>
      </div>
    </div>
  );
}
*/