import { useCallback, useEffect } from 'react';
import type { ModalProps as ModalData } from '../components/(timecard)/Modal'; // You already use this type
import { DayOfWeek, CoursesPerDay } from './useBeforeTC';

type CoursesPerDayByWeek = {
  [weekKey: string]: CoursesPerDay;
};

type UseSaveWeekProps = {
  editing: { [key: string]: number | null },
  tempCourses: CoursesPerDayByWeek,
  setTempCourses: React.Dispatch<React.SetStateAction<CoursesPerDayByWeek>>,
  savedCourses: CoursesPerDayByWeek,
  setSavedCourses: React.Dispatch<React.SetStateAction<CoursesPerDayByWeek>>,
  approvedWeeks: { [weekKey: string]: string | null },
  deliveryDates: { [weekKey: string]: string },
  setDeliveryDates: React.Dispatch<React.SetStateAction<{ [weekKey: string]: string }>>,
  setModal: React.Dispatch<React.SetStateAction<ModalData | null>>,
  week: DayOfWeek[],
  weekKey: string,
  triggerAutoSave: boolean,
  setTriggerAutoSave: React.Dispatch<React.SetStateAction<boolean>>,
};

/*Custom hook for saving and deleting the current week's timecard data.*/
export function useSaveWeek({
  editing,
  tempCourses,
  setTempCourses,
  savedCourses,
  setSavedCourses,
  approvedWeeks,
  setDeliveryDates,
  setModal,
  week,
  weekKey,
  triggerAutoSave,
  setTriggerAutoSave,
}: UseSaveWeekProps) {

  /* Saves the week*/
  const saveWeek = useCallback(async () => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      setModal({
        title: 'Advertencia',
        message: 'No puedes guardar mientras editas.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    const current = tempCourses[weekKey] || {};

    const simplifiedCourses = Object.fromEntries(
      Object.entries(current).map(([iso, entries]) => [
        iso,
        entries.map(c => ({
          title: c.id,
          hours: c.hours
        }))
      ])
    );

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const today = todayDate.toISOString().split('T')[0];

    const body = {
      week,
      coursesPerDay: simplifiedCourses,
      deliveryDate: today,
      approvedDate: approvedWeeks[weekKey] ?? undefined,
      approvedBy: null
    };

    const response = await fetch('/api/timecard/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error('❌ Error guardando semana');
      setSavedCourses(prev => ({ ...prev, [weekKey]: current }));
      setTempCourses(prev => ({ ...prev, [weekKey]: current }));

      setModal({
        title: 'Error',
        message: 'Hubo un error al guardar los datos.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    const updatedSavedCourses = { ...savedCourses, [weekKey]: current };
    setSavedCourses(updatedSavedCourses);
    setTempCourses(prev => ({ ...prev, [weekKey]: current }));
    setDeliveryDates(prev => ({ ...prev, [weekKey]: today }));

    setModal({
      title: 'Guardado',
      message: 'Semana guardada y enviada correctamente.',
      onConfirm: () => setModal(null)
    });
  }, [editing, tempCourses, week, weekKey, approvedWeeks, savedCourses, setDeliveryDates, setModal, setSavedCourses, setTempCourses]);

  /*Deletes all what it has in that week*/
  const deleteAll = () => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      setModal({
        title: 'Advertencia',
        message: 'No puedes eliminar mientras editas.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    setModal({
      title: 'Confirmar',
      message: '¿Estás seguro de que quieres eliminar todo? Esto se guardará automáticamente.',
      confirmText: 'Sí',
      cancelText: 'No',
      onConfirm: () => {
        const updated = { ...tempCourses, [weekKey]: {} };
        setTempCourses(updated);
        setSavedCourses(prev => ({ ...prev, [weekKey]: {} }));
        setTriggerAutoSave(true);
        setModal(null);
      },
      onCancel: () => setModal(null)
    });
  };

  /*Effect hook that auto-saves the week if the Autosave flag is set.*/
  useEffect(() => {
    if (triggerAutoSave) {
      saveWeek();
      setTriggerAutoSave(false);
    }
  }, [triggerAutoSave, saveWeek, setTriggerAutoSave]);

  return { saveWeek, deleteAll };
}
