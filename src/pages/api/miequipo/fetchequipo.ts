// src/pages/api/miequipo/fetchequipo.ts

export interface Empleado {
  id: number;
  name: string;
  photo: string;
  hoursPerDay: number[];
  courses: {
    completed: number;
    inProgress: number;
    incomplete: number;
    notStarted: number;
  };
}

export interface EquipoResponse {
  teamName: string;
  employees: Empleado[];
}

export async function fetchEquipo() {
  const res = await fetch('/api/miequipo/miequipo');
  if (!res.ok) {
    throw new Error('Error al obtener datos');
  }
  return await res.json();
}