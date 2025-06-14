export interface Course {
  id: string;
  title: string;
  hours: number;
}

export interface DayOfWeek {
  name: string;
  date: Date;
  format: string;
  iso: string;
}

export type CoursesPerDay = { [iso: string]: Course[] };

export const getWeekFromBaseDate = (base: Date): DayOfWeek[] => {
  const start = new Date(base);
  start.setHours(0, 0, 0, 0);

  const diffToWednesday = (start.getDay() + 4) % 7;
  start.setDate(start.getDate() - diffToWednesday);

  const days = [
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
    "Lunes",
    "Martes",
  ];
  const week: DayOfWeek[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    const format = date.toLocaleDateString("es-MX");
    const iso = date.toISOString().split("T")[0];

    week.push({ name: days[i], date, format, iso });
  }

  return week;
};

export const statusFormatted = (state?: string): string => {
  switch ((state || "").toLowerCase()) {
    case "enviado":
      return "Enviado";
    case "aprobado":
      return "Aprobado";
    default:
      return "Abierto";
  }
};
