import { WeekDay } from "@/app/types/employee";

const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const getWeekFromBaseDate = (base: Date): WeekDay[] => {
  if (!base || !isValidDate(base)) {
    console.error("getWeekFromBaseDate: Fecha inválida recibida:", base);

    base = new Date();
  }

  const start = new Date(base);
  start.setHours(0, 0, 0, 0);

  const currentDay = start.getDay();
  let daysToWednesday;

  if (currentDay === 0) {
    daysToWednesday = 4;
  } else if (currentDay === 1) {
    daysToWednesday = 5;
  } else if (currentDay === 2) {
    daysToWednesday = 6;
  } else if (currentDay >= 3) {
    daysToWednesday = currentDay - 3;
  } else {
    daysToWednesday = 0;
  }

  start.setDate(start.getDate() - daysToWednesday);

  const days = [
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
    "Lunes",
    "Martes",
  ];
  const week: WeekDay[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    if (!isValidDate(date)) {
      console.error(`Error generando día ${i} de la semana`);
      continue;
    }

    try {
      const format = date.toLocaleDateString("es-MX");
      const iso = date.toISOString().split("T")[0];

      week.push({
        name: days[i],
        date: new Date(date),
        format,
        iso,
      });
    } catch (error) {
      console.error(`Error formateando fecha para día ${days[i]}:`, error);

      week.push({
        name: days[i],
        date: new Date(),
        format: "Error",
        iso: "1970-01-01",
      });
    }
  }

  return week;
};

export const getCurrentWeek = (): WeekDay[] => {
  return getWeekFromBaseDate(new Date());
};

export const getWeekKey = (week: WeekDay[]): string => {
  if (!week || week.length === 0) {
    console.error("getWeekKey: Semana vacía o inválida");
    return new Date().toISOString().split("T")[0];
  }

  return week[0].iso;
};

export const getWednesdayOfWeek = (date: Date): string => {
  const baseDate = new Date(date);
  const currentDay = baseDate.getDay();
  let daysToWednesday;

  if (currentDay === 0) {
    daysToWednesday = 4;
  } else if (currentDay === 1) {
    daysToWednesday = 5;
  } else if (currentDay === 2) {
    daysToWednesday = 6;
  } else if (currentDay >= 3) {
    daysToWednesday = currentDay - 3;
  } else {
    daysToWednesday = 0;
  }

  baseDate.setDate(baseDate.getDate() - daysToWednesday);
  return baseDate.toISOString().split("T")[0];
};

export const getWeekFromISOString = (isoString: string): WeekDay[] => {
  if (!isoString || typeof isoString !== "string") {
    console.error("getWeekFromISOString: ISO string inválido:", isoString);
    return getCurrentWeek();
  }

  try {
    const date = new Date(isoString);
    if (!isValidDate(date)) {
      throw new Error("Fecha inválida");
    }
    return getWeekFromBaseDate(date);
  } catch (error) {
    console.error("Error parseando ISO string:", isoString, error);
    return getCurrentWeek();
  }
};

export const formatWeekRange = (week: WeekDay[]): string => {
  if (!week || week.length < 7) {
    return "Semana inválida";
  }

  try {
    const start = week[0].format;
    const end = week[6].format;
    return `${start} - ${end}`;
  } catch (error) {
    console.error("Error formateando rango de semana:", error);
    return "Error en formato";
  }
};

export const isCurrentWeek = (weekKey: string): boolean => {
  try {
    const current = getCurrentWeek();
    const currentKey = getWeekKey(current);
    return weekKey === currentKey;
  } catch (error) {
    console.error("Error verificando semana actual:", error);
    return false;
  }
};

export const validateWeekStart = (inicio_semana: string): boolean => {
  try {
    const date = new Date(inicio_semana);
    return date.getDay() === 3;
  } catch {
    return false;
  }
};
