export interface WeekDay {
  name: string;
  date: Date;
  format: string;
  iso: string;
}

export interface ProjectHours {
  id_proyecto: string;
  nombre_proyecto: string;
  horas: number;
}

export interface ProjectInfo {
  id_proyecto: string;
  nombre: string;
}

export interface DayHours {
  fecha_trabajada: string;
  proyectos: ProjectHours[];
  total_horas: number;
}

export interface WeekData {
  id_semana: number;
  id_usuario: string;
  inicio_semana: string;
  fin_semana: string;
  enviado_el: string | null;
  estado: "borrador" | "enviado" | "aprobado" | "rechazado";
  aprobado_por: string | null;
  aprobado_el: string | null;
  horas_totales: number;
  dias: DayHours[];
}

export interface Employee {
  id: string;
  name: string;
  photo: string;
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
