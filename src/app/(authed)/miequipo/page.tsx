'use client';

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
