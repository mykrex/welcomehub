//./hooks/usebeforeTimecard.ts
//Here we have most of functions outside of the main functions, Timecard
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

/*Returns an array of 7 days starting from the previous Wednesday */
export const getWeekFromBaseDate = (base: Date): DayOfWeek[] => {
  const start = new Date(base);
  start.setHours(0, 0, 0, 0); // SUPERIMPORTANT, It makes so your timezone match, this could change

  const diffToWednesday = (start.getDay() + 4) % 7; // Start with Wednesday
  start.setDate(start.getDate() - diffToWednesday);

  const days = ['Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Lunes', 'Martes'];
  const week: DayOfWeek[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    const format = date.toLocaleDateString('es-MX');
    const iso = date.toISOString().split('T')[0];

    week.push({ name: days[i], date, format, iso });
  }

  return week;
};

/* Formats the week state string to start with a capital letter */
export const statusFormatted = (state?: string): string => {
  switch ((state || '').toLowerCase()) {
    case 'enviado':
      return 'Enviado';
    case 'aprobado':
      return 'Aprobado';
    default:
      return 'Abierto';
  }
};
