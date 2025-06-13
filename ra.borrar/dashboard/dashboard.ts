// src/api/dashboard.ts

type Curso = {
  id: number;
  nombre: string;
  estado: "En Proceso" | "Faltante" | "Completado";
  abierto: string;
  modulosCompletados: number;
  totalModulos: number;
};

const cursos: Curso[] = [
  {
    id: 1,
    nombre: "Atención al Cliente y Ventas",
    estado: "En Proceso",
    abierto: "Abierto hoy",
    modulosCompletados: 3,
    totalModulos: 5,
  },
  {
    id: 2,
    nombre: "Introducción a Excel",
    estado: "En Proceso",
    abierto: "Abierto hace 2 días",
    modulosCompletados: 1,
    totalModulos: 5,
  },
  {
    id: 3,
    nombre: "Crecimiento corporativo",
    estado: "Faltante",
    abierto: "Sin abrir",
    modulosCompletados: 0,
    totalModulos: 5,
  },
  {
    id: 4,
    nombre: "Técnicas de trabajo en equipo",
    estado: "Faltante",
    abierto: "Sin abrir",
    modulosCompletados: 0,
    totalModulos: 5,
  },
  {
    id: 5,
    nombre: "Liderazgo y Gestión de Equipos",
    estado: "Completado",
    abierto: "Abierto hace 1 semana",
    modulosCompletados: 5,
    totalModulos: 5,
  },
  {
    id: 6,
    nombre: "Marketing Digital",
    estado: "En Proceso",
    abierto: "Abierto hace 3 días",
    modulosCompletados: 2,
    totalModulos: 5,
  },
  {
    id: 7,
    nombre: "Programación Básica",
    estado: "Completado",
    abierto: "Abierto hace 5 días",
    modulosCompletados: 5,
    totalModulos: 5,
  },
];

// Otros datos simulados
const tiempoPromedio = 45; // en minutos
const puntajePromedio = 75; // en porcentaje

// Funciones simuladas
export const getCursos = async (): Promise<Curso[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(cursos), 300); // retardo de 300ms
  });
};

export const getTiempoPromedio = async (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(tiempoPromedio), 300);
  });
};

export const getPuntajePromedio = async (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(puntajePromedio), 300);
  });
};
