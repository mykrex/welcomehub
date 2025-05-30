// utils/weekUtils.ts - VERSIÓN MEJORADA
import { WeekDay } from "@/app/types/employee";

/**
 * Valida si una fecha es válida
 */
const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Crea una semana de miércoles a martes a partir de una fecha base
 */
export const getWeekFromBaseDate = (base: Date): WeekDay[] => {
  // Validar entrada
  if (!base || !isValidDate(base)) {
    console.error('getWeekFromBaseDate: Fecha inválida recibida:', base);
    // Fallback a fecha actual
    base = new Date();
  }

  const start = new Date(base);
  start.setHours(0, 0, 0, 0);

  // Encontrar el miércoles de esa semana (inicio de nuestra semana)
  const diffToWednesday = (start.getDay() + 4) % 7;
  start.setDate(start.getDate() - diffToWednesday);

  const days = ['Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Lunes', 'Martes'];
  const week: WeekDay[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    // Validar que la fecha generada es válida
    if (!isValidDate(date)) {
      console.error(`Error generando día ${i} de la semana`);
      continue;
    }

    try {
      const format = date.toLocaleDateString('es-MX');
      const iso = date.toISOString().split('T')[0];

      week.push({ 
        name: days[i], 
        date: new Date(date), // Crear nueva instancia para evitar referencias
        format, 
        iso 
      });
    } catch (error) {
      console.error(`Error formateando fecha para día ${days[i]}:`, error);
      // Crear un día por defecto para no romper la semana
      week.push({
        name: days[i],
        date: new Date(),
        format: 'Error',
        iso: '1970-01-01'
      });
    }
  }

  return week;
};

/**
 * Obtiene la semana actual (miércoles a martes)
 */
export const getCurrentWeek = (): WeekDay[] => {
  return getWeekFromBaseDate(new Date());
};

/**
 * Obtiene la clave única de una semana (ISO del miércoles)
 */
export const getWeekKey = (week: WeekDay[]): string => {
  if (!week || week.length === 0) {
    console.error('getWeekKey: Semana vacía o inválida');
    return new Date().toISOString().split('T')[0]; // Fallback
  }
  
  return week[0].iso; // Usar el ISO del miércoles como key
};

/**
 * Convierte un string de fecha ISO a WeekDay[] (utilidad adicional)
 */
export const getWeekFromISOString = (isoString: string): WeekDay[] => {
  if (!isoString || typeof isoString !== 'string') {
    console.error('getWeekFromISOString: ISO string inválido:', isoString);
    return getCurrentWeek();
  }

  try {
    const date = new Date(isoString);
    if (!isValidDate(date)) {
      throw new Error('Fecha inválida');
    }
    return getWeekFromBaseDate(date);
  } catch (error) {
    console.error('Error parseando ISO string:', isoString, error);
    return getCurrentWeek();
  }
};

/**
 * Formatea una fecha para mostrar en UI (utilidad adicional)
 */
export const formatWeekRange = (week: WeekDay[]): string => {
  if (!week || week.length < 7) {
    return 'Semana inválida';
  }

  try {
    const start = week[0].format; // Miércoles
    const end = week[6].format;   // Martes
    return `${start} - ${end}`;
  } catch (error) {
    console.error('Error formateando rango de semana:', error);
    return 'Error en formato';
  }
};

/**
 * Verifica si una semana es la semana actual
 */
export const isCurrentWeek = (weekKey: string): boolean => {
  try {
    const current = getCurrentWeek();
    const currentKey = getWeekKey(current);
    return weekKey === currentKey;
  } catch (error) {
    console.error('Error verificando semana actual:', error);
    return false;
  }
};