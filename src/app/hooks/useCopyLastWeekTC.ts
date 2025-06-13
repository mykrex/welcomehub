// /.hooks/usecopyLastWeek.ts
import { useCallback } from 'react';
import { fetchWeekData } from '@/pages/api/timecard/fetchTimeCard';
import { getWeekFromBaseDate } from './useBeforeTC';
import type { ModalProps as ModalData } from '../components/(timecard)/Modal';

interface Course {
  id: string;
  title: string;
  hours: number;
}

interface DayOfWeek {
  name: string;
  date: Date;
  format: string;
  iso: string;
}

type CoursesPerDay = { [iso: string]: Course[] };

// Custom hook to encapsulate the "Copy Last Week" logic
interface UseCopyLastWeekProps {
  editing: { [key: string]: number | null };
  startDate: Date;
  week: DayOfWeek[];
  weekKey: string;
  setModal: React.Dispatch<React.SetStateAction<ModalData | null>>;
  setTempCourses: React.Dispatch<React.SetStateAction<{ [key: string]: CoursesPerDay }>>;
  setSavedCourses: React.Dispatch<React.SetStateAction<{ [key: string]: CoursesPerDay }>>;
  setTriggerAutoSave: (value: boolean) => void;
}

export const useCopyLastWeek = ({
  editing,
  startDate,
  week,
  weekKey,
  setModal,
  setTempCourses,
  setSavedCourses,
  setTriggerAutoSave,
}: UseCopyLastWeekProps) => {
  const copyLastWeek = useCallback(() => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      setModal({
        title: 'Advertencia',
        message: 'No puedes copiar la semana pasada mientras editas.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    setModal({
      title: 'Confirmar',
      message: '¿Deseas duplicar los proyectos de la semana pasada? Esto borrará lo actual y lo guardará automáticamente.',
      confirmText: 'Sí',
      cancelText: 'No',
      onConfirm: async () => {
        const prevWeekDate = new Date(startDate);
        prevWeekDate.setDate(startDate.getDate() - 7);

        const prevWeek = getWeekFromBaseDate(prevWeekDate);

        try {
          const prevData = await fetchWeekData(prevWeek[0].iso);
          const prevCourses = prevData.registros.reduce((acc: CoursesPerDay, r) => {
            if (!acc[r.fecha_trabajada]) acc[r.fecha_trabajada] = [];
            acc[r.fecha_trabajada].push({
              id: r.proyecto.id_proyecto,
              title: r.proyecto.nombre,
              hours: r.horas,
            });
            return acc;
          }, {} as CoursesPerDay);

          const newWeekCourses: CoursesPerDay = {};
          week.forEach((day, i) => {
            const prevDay = prevWeek[i];
            if (prevDay && prevCourses[prevDay.iso]) {
              newWeekCourses[day.iso] = prevCourses[prevDay.iso].map(c => ({
                id: c.id,
                title: c.title,
                hours: c.hours
              }));
            }
          });

          setTempCourses(prev => ({ ...prev, [weekKey]: newWeekCourses }));
          setSavedCourses(prev => ({ ...prev, [weekKey]: newWeekCourses }));
          setTriggerAutoSave(true);
          setModal(null);
        } catch (error) {
          console.error("❌ Error al copiar semana pasada:", error);
          setModal({
            title: "Error",
            message: "No se pudo cargar la semana anterior desde el servidor.",
            onConfirm: () => setModal(null)
          });
        }
      },
      onCancel: () => setModal(null)
    });
  }, [editing, startDate, week, weekKey, setModal, setTempCourses, setSavedCourses, setTriggerAutoSave]);

  return { copyLastWeek };
};
