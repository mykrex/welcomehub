export interface Empleado {
  id: number;
  name: string;
  photo: string;
  hoursPerDay: number[];
  courses: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  obligatoryCourses: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  isAdmin?: boolean;
}

export interface EquipoResponse {
  teamName: string;
  employees: Empleado[];
}

export async function fetchEquipo(): Promise<EquipoResponse> {
  const res = await fetch("/api/miequipo/miequipo");
  if (!res.ok) {
    throw new Error("Error al obtener datos");
  }
  return await res.json();
}
