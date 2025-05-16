'use client';

import React, { useEffect, useState } from 'react';
import './AdminPanel.css';
import EmployeeCard from './EmployeeCard';
import EmployeeDetails from './EmployeeDetails';
import { getTeamInfo, Employee } from '@/app/api/miequipo/miequipo';

export default function AdminPanel() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teamName, setTeamName] = useState<string>('...');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  useEffect(() => {
    getTeamInfo().then((team) => {
      setTeamName(team.teamName);
      setEmployees(team.employees);
    });
  }, []);

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
        employee={emp}
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