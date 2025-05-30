// src/pages/api/timecard/fetchTimeCard.ts

export interface WeekData {
  semana: {
    id_semana: string;
    id_usuario: string;
    inicio_semana: string;
    fin_semana: string;
    estado: 'Enviado' | 'Abierto' | 'Aprobado';
    enviado_el?: string;
    aprobado_el?: string;
    aprobado_por?: string;
    horas_totales: number;
  } | null;
  registros: {
    id_horas: string;
    fecha_trabajada: string;
    horas: number;
    proyecto: {
      id_proyecto: string;
      nombre: string;
    };
  }[];
  proyectosDisponibles: {
    id_proyecto: string;
    nombre: string;
  }[];
}

export async function fetchWeekData(inicioSemana: string): Promise<WeekData> {
  const res = await fetch(`/api/timecard/obtain?inicioSemana=${inicioSemana}`);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Fallo al obtener datos. Código:', res.status);
    console.error('Respuesta:', errorText);
    throw new Error('Error al obtener los datos de la semana');
  }

  return res.json();
}
