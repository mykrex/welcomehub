'use client';

import React, { useEffect, useState } from 'react';
import './AdminPanel.css';
import EmployeeCard from './EmployeeCard';
import EmployeeDetails from './EmployeeDetails';
import { fetchFakeEquipo, EmpleadoNuevo } from '@/pages/api/miequipo/fakefetch';
//import { fetchEquipo, Empleado as EmpleadoAPI } from '@/pages/api/miequipo/fetchequipo';
import { fetchEquipo} from '@/pages/api/miequipo/fetchequipo';


function getStartOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
}

function formatWeekRange(date: Date): string {
  const start = getStartOfWeek(new Date(date));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const format = (d: Date) =>
    `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear().toString().slice(-2)}`;
  return `${format(start)} - ${format(end)}`;
}

export default function AdminPanel() {
  const [teamName, setTeamName] = useState<string>('...');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedWeekDate, setSelectedWeekDate] = useState<Date>(getStartOfWeek(new Date()));
  const [weekData, setWeekData] = useState<{ [weekKey: string]: EmpleadoNuevo[] }>({});
  const [deliveryDates, setDeliveryDates] = useState<{ [week: string]: { [id: number]: string | null } }>({});
  const [approvalDates, setApprovalDates] = useState<{ [week: string]: { [id: number]: string | null } }>({});
  const [loading, setLoading] = useState(true);

  const selectedWeekKey = selectedWeekDate.toISOString().slice(0, 10);

  useEffect(() => {
    const storedDelivery = localStorage.getItem('deliveryDates');
    const storedApproval = localStorage.getItem('approvalDates');

    if (storedDelivery) setDeliveryDates(JSON.parse(storedDelivery));
    if (storedApproval) setApprovalDates(JSON.parse(storedApproval));
  }, []);

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchEquipo();

      const realData: EmpleadoNuevo[] = response.employees.map(emp => ({
        ...emp,
        projectsPerDay: {},     // puedes llenarlo después si lo conectas con DB real
        deliveryDate: null,
        approvalDate: null,
      }));

      // Agrega el empleado fake con id fijo (ejemplo: 10)
      const fake = await fetchFakeEquipo();
      const fakeEmpleado = fake.employees.find(e => e.id === 1);
      if (fakeEmpleado) {
        fakeEmpleado.id = 10; // asegura que tenga un id único de test
        realData.push(fakeEmpleado);
      }

      setTeamName(response.teamName);
      setWeekData((prev) => ({
        ...prev,
        [selectedWeekKey]: realData,
      }));
    } catch (err) {
      console.error('Error al obtener datos del equipo:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!weekData[selectedWeekKey]) {
    fetchData();
  }
}, [selectedWeekKey, weekData]);
/* Este es de ejemplo
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data;

        // Aquí decides qué usar: fake o real
        if (selectedWeekKey === getStartOfWeek(new Date()).toISOString().slice(0, 10)) {
          // Semana actual → usar datos REALES
          const response = await fetchEquipo();
          data = response.employees.map(emp => ({
            ...emp,
            projectsPerDay: {},         // vacía para mantener compatibilidad
            deliveryDate: null,
            approvalDate: null,
          }));

          setTeamName(response.teamName);
        } else {
          // Otras semanas → usar datos FAKE
          const fake = await fetchFakeEquipo();
          data = fake.employees;
          setTeamName(fake.teamName);
        }

        setWeekData((prev) => ({
          ...prev,
          [selectedWeekKey]: data,
        }));
      } catch (err) {
        console.error('Error al obtener datos del equipo:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!weekData[selectedWeekKey]) {
      fetchData();
    }
  }, [selectedWeekKey]);
*/
  const handleWeekChange = (direction: 'prev' | 'next') => {
    const diff = direction === 'prev' ? -7 : 7;
    const newDate = new Date(selectedWeekDate);
    newDate.setDate(newDate.getDate() + diff);
    const newStart = getStartOfWeek(newDate);
    const newWeekKey = newStart.toISOString().slice(0, 10);
    setSelectedWeekDate(newStart);

    if (!weekData[newWeekKey]) {
      setLoading(true); // activa loading al cambiar
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  const employees = weekData[selectedWeekKey] || [];

  return (
    <div className="admin-container">
      <div className="header">
        <h2>Mi equipo: {teamName}</h2>
        <div className="week-controls">
          <button className="small-button" onClick={() => handleWeekChange('prev')}>
            ← Semana anterior
          </button>
          <span className="week-label">Semana: {formatWeekRange(selectedWeekDate)}</span>
          <button className="small-button" onClick={() => handleWeekChange('next')}>
            Semana siguiente →
          </button>
        </div>
        <span className="employee-count">Cantidad de empleados: {employees.length}</span>
      </div>

      <div className="employee-table">
        {employees.map((emp) => (
          <div key={emp.id} style={{ width: '100%' }}>
            <EmployeeCard
              employee={{ id: emp.id, name: emp.name, photo: emp.photo }}
              isSelected={selectedEmployeeId === emp.id}
              onSelect={() => {
                setSelectedEmployeeId(prev => (prev === emp.id ? null : emp.id));
              }}
            />
            {selectedEmployeeId === emp.id && (
              <div className="employee-details-wrapper">
                <EmployeeDetails
                  employee={emp}
                  selectedWeek={selectedWeekKey}
                  deliveryDates={deliveryDates}
                  setDeliveryDates={setDeliveryDates}
                  approvalDates={approvalDates}
                  setApprovalDates={setApprovalDates}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


/*'use client';

import React, { useEffect, useState } from 'react';
import './AdminPanel.css';
import EmployeeCard from './EmployeeCard';
import EmployeeDetails from './EmployeeDetails';
import { fetchFakeEquipo, EmpleadoNuevo } from '@/pages/api/miequipo/fakefetch';

function getStartOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
}

function formatWeekRange(date: Date): string {
  const start = getStartOfWeek(new Date(date));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const format = (d: Date) =>
    `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear().toString().slice(-2)}`;
  return `${format(start)} - ${format(end)}`;
}

export default function AdminPanel() {
  const [teamName, setTeamName] = useState<string>('...');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedWeekDate, setSelectedWeekDate] = useState<Date>(getStartOfWeek(new Date()));
  const [weekData, setWeekData] = useState<{ [weekKey: string]: EmpleadoNuevo[] }>({});
  const [deliveryDates, setDeliveryDates] = useState<{ [week: string]: { [id: number]: string | null } }>({});
  const [approvalDates, setApprovalDates] = useState<{ [week: string]: { [id: number]: string | null } }>({});
  const [loading, setLoading] = useState(true);

  const selectedWeekKey = selectedWeekDate.toISOString().slice(0, 10);

  // Cargar datos desde localStorage una sola vez
  useEffect(() => {
    const storedDelivery = localStorage.getItem('deliveryDates');
    const storedApproval = localStorage.getItem('approvalDates');

    if (storedDelivery) setDeliveryDates(JSON.parse(storedDelivery));
    if (storedApproval) setApprovalDates(JSON.parse(storedApproval));
  }, []);

  // Cargar datos falsos de empleados por semana
  useEffect(() => {
    if (!weekData[selectedWeekKey]) {
      fetchFakeEquipo()
        .then((data) => {
          setTeamName(data.teamName);
          setWeekData((prev) => ({
            ...prev,
            [selectedWeekKey]: data.employees,
          }));
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error al obtener datos del equipo:', err);
          setLoading(false);
        });
    }
  }, [selectedWeekKey]);

  const handleWeekChange = (direction: 'prev' | 'next') => {
    const diff = direction === 'prev' ? -7 : 7;
    const newDate = new Date(selectedWeekDate);
    newDate.setDate(newDate.getDate() + diff);
    const newStart = getStartOfWeek(newDate);
    const newWeekKey = newStart.toISOString().slice(0, 10);
    setSelectedWeekDate(newStart);

    if (!weekData[newWeekKey]) {
      fetchFakeEquipo().then((data) => {
        setWeekData((prev) => ({ ...prev, [newWeekKey]: data.employees }));
      });
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  const employees = weekData[selectedWeekKey] || [];

  return (
    <div className="admin-container">
      <div className="header">
        <h2>Mi equipo: {teamName}</h2>
        <div className="week-controls">
          <button className="small-button" onClick={() => handleWeekChange('prev')}>
            ← Semana anterior
          </button>
          <span className="week-label">Semana: {formatWeekRange(selectedWeekDate)}</span>
          <button className="small-button" onClick={() => handleWeekChange('next')}>
            Semana siguiente →
          </button>
        </div>
        <span className="employee-count">Cantidad de empleados: {employees.length}</span>
      </div>

      <div className="employee-table">
        {employees.map((emp) => (
          <div key={emp.id} style={{ width: '100%' }}>
            <EmployeeCard
              employee={{ id: emp.id, name: emp.name, photo: emp.photo }}
              isSelected={selectedEmployeeId === emp.id}
              onSelect={() => {
                setSelectedEmployeeId(prev => (prev === emp.id ? null : emp.id));
              }}
            />
            {selectedEmployeeId === emp.id && (
              <div className="employee-details-wrapper">
                <EmployeeDetails
                  employee={emp}
                  selectedWeek={selectedWeekKey}
                  deliveryDates={deliveryDates}
                  setDeliveryDates={setDeliveryDates}
                  approvalDates={approvalDates}
                  setApprovalDates={setApprovalDates}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

*/

/*'use client';

import React, { useEffect, useState } from 'react';
import './AdminPanel.css';
import EmployeeCard from './EmployeeCard';
import EmployeeDetails from './EmployeeDetails';
import { fetchEquipo, Empleado } from '@/pages/api/miequipo/fetchequipo';

export default function AdminPanel() {
  const [employees, setEmployees] = useState<Empleado[]>([]);
  const [teamName, setTeamName] = useState<string>('...');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipo().then((data) => {
      setTeamName(data.teamName);
      setEmployees(data.employees);
      setLoading(false);
    }).catch((err) => {
      console.error('Error al obtener datos del equipo:', err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className = "loading">Cargando...</div>;

  return (
    <div className="admin-container">
      <div className="header">
        <h2>Mi equipo: {teamName}</h2>
        <span className="employee-count">Cantidad de empleados: {employees.length}</span>
      </div>

      <div className="employee-table">
        {employees.map(emp => (
          <div key={emp.id} style={{ width: '100%' }}>
            <EmployeeCard
              employee={{ id: emp.id, name: emp.name, photo: emp.photo }}
              isSelected={selectedEmployeeId === emp.id}
              onSelect={() =>
                setSelectedEmployeeId(prev => (prev === emp.id ? null : emp.id))
              }
            />
            {selectedEmployeeId === emp.id && (
              <div className="employee-details-wrapper">
                <EmployeeDetails employee={emp} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
*/