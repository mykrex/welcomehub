'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import { fetchWeekData } from "@/pages/api/timecard/fetchTimeCard";
import './TimeCard.css';
import TimeTable from './TimeTable';
import ButtonsBar from './ButtonsBar';
import CalendarStatus from './CalendarStatus';

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

// Returns an array of 7 days starting from the previous Wednesday
const getWeekFromBaseDate = (base: Date): DayOfWeek[] => {
  const start = new Date(base);
  start.setHours(0, 0, 0, 0); // SUPERIMPORTANT, It makes so your timezone match, this could change

  const diffToWednesday = (start.getDay() + 4) % 7; // Start with Saturday
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

// Formats the week state string to start with a capital letter
const statusFormatted = (state?: string) => {
  switch ((state || '').toLowerCase()) {
    case 'enviado':
      return 'Enviado';
    case 'aprobado':
      return 'Aprobado';
    default:
      return 'Abierto';
  }
};

// Main component for rendering the time card UI
const TimeCard = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [week, setWeek] = useState<DayOfWeek[]>([]);
  const [tempCourses, setTempCourses] = useState<{ [weekKey: string]: CoursesPerDay }>({});
  const [savedCourses, setSavedCourses] = useState<{ [weekKey: string]: CoursesPerDay }>({});
  const [approvedWeeks, setApprovedWeeks] = useState<{ [weekKey: string]: string | null }>({});
  const [weekStates, setWeekStates] = useState<{ [weekKey: string]: string }>({});
  const [deliveryDates, setDeliveryDates] = useState<{ [weekKey: string]: string }>({});
  const [expanded, setExpanded] = useState<{ [index: number]: boolean }>({});
  const [editing, setEditing] = useState<{ [iso: string]: number | null }>({});
  const [draftCourse, setDraftCourse] = useState<{ [iso: string]: Course }>({});
  const [projectOptions, setProjectOptions] = useState<{ id_proyecto: string; nombre: string }[]>([]);
  const [triggerAutoSave, setTriggerAutoSave] = useState(false);

  const [modal, setModal] = useState<null | {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }>(null);

  // Runs when the startDate changes, recalculates the week and editing state
  useEffect(() => {
    const result = getWeekFromBaseDate(startDate);
    setWeek(result);
    const initialEditingState: { [iso: string]: number | null } = {};
    result.forEach(day => {
      initialEditingState[day.iso] = null;
    });
    setEditing(initialEditingState);
  }, [startDate]);

  const weekKey = week.map(d => d.iso).join(',');

  // Checks if a selected date belongs to the current week
  const isCurrentWeek = (selectedDate: Date) => {
    const today = new Date();
    const startOfTodayWeek = getWeekFromBaseDate(today).map(d => d.iso).join(',');
    const startOfSelectedWeek = getWeekFromBaseDate(selectedDate).map(d => d.iso).join(',');
    return startOfTodayWeek === startOfSelectedWeek;
  };

  // Returns whether the current week is editable
  const isEditable = isCurrentWeek(startDate);

  // Loads timecard data from the API for the current week
  useEffect(() => {
    const loadFromAPI = async () => {
      if (week.length !== 7) return;

      try {
        const data = await fetchWeekData(week[0].iso);
        if (!data) return;

        const { semana, registros, proyectosDisponibles } = data;

        const grouped: CoursesPerDay = {};
        for (const r of registros) {
          if (!grouped[r.fecha_trabajada]) grouped[r.fecha_trabajada] = [];
          grouped[r.fecha_trabajada].push({
            id: r.proyecto.id_proyecto, // Include Id projects
            title: r.proyecto.nombre,
            hours: r.horas,
          });
        }

        const newWeekKey = week.map(d => d.iso).join(',');

        setWeekStates(prev => ({
          ...prev,
          [newWeekKey]: semana?.estado || 'Abierto',
        }));

        setSavedCourses(prev => ({ ...prev, [newWeekKey]: grouped }));
        setTempCourses(prev => ({ ...prev, [newWeekKey]: grouped }));
        setDeliveryDates(prev => ({
          ...prev,
          [newWeekKey]: semana?.enviado_el || '',
        }));
        setApprovedWeeks(prev => ({
          ...prev,
          [newWeekKey]: semana?.aprobado_el || null,
        }));

        setProjectOptions(proyectosDisponibles);
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
      }
    };

    loadFromAPI();
  }, [week]);

  // Returns the list of courses for a specific day (by ISO date)
  const getCoursesForDay = (iso: string): Course[] => {
    return tempCourses[weekKey]?.[iso] || [];
  };

  // Starts editing a specific course for a given day
  const startEdit = (iso: string, index: number, course: Course) => {
    const isEditingNow = Object.values(editing).some(i => i !== null);
    if (isEditingNow) {
      setModal({
        title: 'Advertencia',
        message: 'Ya estás editando otro proyecto. Termínalo antes de continuar.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    setEditing(prev => ({ ...prev, [iso]: index }));
    setDraftCourse(prev => ({ ...prev, [iso]: { ...course } }));
  };

  // Confirms the edit of a course and updates it in the tempCourses state
  const confirmEdit = (iso: string, index: number) => {
    const updated = draftCourse[iso];
    if (!updated || !updated.id || updated.title.trim() === '') {
      setModal({
        title: 'Error',
        message: 'Debes seleccionar un proyecto válido antes de aceptar.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    setTempCourses(prev => {
      const dayCourses = prev[weekKey]?.[iso] || [];
      const newCourses = [...dayCourses];
      newCourses[index] = updated;
      return {
        ...prev,
        [weekKey]: {
          ...prev[weekKey],
          [iso]: newCourses,
        },
      };
    });

    setEditing(prev => ({ ...prev, [iso]: null }));
  };
  // Cancels editing for a given day. If the last course is empty and unsaved, it removes it.
  const cancelEdit = (iso: string) => {
    const dayCourses = tempCourses[weekKey]?.[iso] || [];
    if (dayCourses.length > 0) {
      const lastCourse = dayCourses[dayCourses.length - 1];
      if (!lastCourse.id && lastCourse.title.trim() === '' && lastCourse.hours === 0) {
        const newCourses = dayCourses.slice(0, -1);
        setTempCourses(prev => ({
          ...prev,
          [weekKey]: {
            ...prev[weekKey],
            [iso]: newCourses,
          }
        }));
      }
    }
    setEditing(prev => ({ ...prev, [iso]: null }));
  };

  // Deletes a course by its index on a given day. Prevents deletion if there's active editing.
  const deleteCourse = (iso: string, index: number) => {
    const isEditingNow = Object.values(editing).some(i => i !== null);
    if (isEditingNow) {
      setModal({
        title: 'Advertencia',
        message: 'No puedes borrar mientras estás editando otro proyecto.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    setTempCourses(prev => {
      const dayCourses = prev[weekKey]?.[iso] || [];
      const newCourses = dayCourses.filter((_, i) => i !== index);
      return {
        ...prev,
        [weekKey]: {
          ...prev[weekKey],
          [iso]: newCourses,
        },
      };
    });
  };

  // Adds a new course (empty) to a given day and sets it in editing mode.
  const addCourse = (iso: string) => {
    if (editing[iso] !== null && editing[iso] !== undefined) return;
    setTempCourses(prev => {
      const existing = prev[weekKey]?.[iso] || [];
      const newCourses = [...existing, { id: '', title: '', hours: 0 }];
      return {
        ...prev,
        [weekKey]: {
          ...prev[weekKey],
          [iso]: newCourses,
        },
      };
    });
    setEditing(prev => ({ ...prev, [iso]: (getCoursesForDay(iso).length || 0) }));
    setDraftCourse(prev => ({ ...prev, [iso]: { id: '', title: '', hours: 0 } }));
  };

  // Computes the total number of hours worked in the current week.
  const totalHours = week.reduce((acc, day) => {
    const courses = getCoursesForDay(day.iso);
    return acc + courses.reduce((sum, c) => sum + c.hours, 0);
  }, 0);

  // Checks if the current week has no changes and no active editing.
  const isWeekClean = (): boolean => {
    const noEditing = Object.values(editing).every(index => index === null);
    const current = tempCourses[weekKey] || {};
    const saved = savedCourses[weekKey] || {};
    const unchanged = JSON.stringify(current) === JSON.stringify(saved);
    return noEditing && unchanged;
  };

  // Changes the current week by shifting the base date by a given number of days.
  const changeWeek = (days: number) => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      setModal({
        title: 'Advertencia',
        message: 'No puedes cambiar de semana mientras estás editando.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    if (!isWeekClean()) {
      setModal({
        title: 'Advertencia',
        message: 'Antes de cambiar de semana, debes guardar los cambios.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + days);
    setStartDate(newDate);
    setExpanded({});
  };

  // Toggles the expansion state of a day's section. Cancels edit if the day is currently being edited.
  const toggleExpand = (index: number) => {
    const iso = week[index]?.iso;
    const isEditingThisDay = editing[iso] !== null && editing[iso] !== undefined;
    if (isEditingThisDay) {
      cancelEdit(iso);
    }
    setExpanded(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Copies the previous week's courses into the current week.
  const copyLastWeek = async () => {
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
          }, {});

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
  };

  // Deletes all course data from the current week.
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

  // Saves the current week's courses to the backend.
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
          title: c.id, // Project ID is sent in place of the title
          hours: c.hours
        }))
      ])
    );

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0); // Establece la hora local a medianoche (evita el desfase por zona horaria)
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
  }, [editing, tempCourses, week, weekKey, approvedWeeks, savedCourses]);

  // Triggers auto-save when required
  useEffect(() => {
    if (triggerAutoSave) {
      saveWeek();
      setTriggerAutoSave(false);
    }
  }, [triggerAutoSave, saveWeek]);

  // Useful values for current month and week number
  const today = new Date();
  const currentMonth = today.toLocaleString('es-MX', { month: 'long' });
  const monthName = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
  const weekNumber = week.length
    ? Math.ceil((week[0].date.getTime() - new Date(week[0].date.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7))
    : 0;


  return (
    <div className="timecard-container">
      <div className="timecard-box">

        {/* HEADER */}
        <div className="header">
          <button className="nav-btn" onClick={() => changeWeek(-7)}>‹ Periodo Anterior</button>
          <h2 className="weekendpayment">
            <strong>Periodo de Pago:</strong> {week[0]?.format} - {week[6]?.format}
          </h2>
          <button className="nav-btn" onClick={() => changeWeek(7)}>Siguiente Periodo ›</button>
        </div>

        {/* CALENDAR AND ESTATUS */}
        <CalendarStatus
          today={today}
          monthName={monthName}
          weekStates={weekStates}
          weekKey={weekKey}
          totalHours={totalHours}
          weekNumber={weekNumber}
          week={week}
          deliveryDates={deliveryDates}
          approvedWeeks={approvedWeeks}
          statusFormatted={statusFormatted}
        />
        {/* HOURS TABLE */}
        <TimeTable
          week={week}
          expanded={expanded}
          editing={editing}
          draftCourse={draftCourse}
          projectOptions={projectOptions}
          getCoursesForDay={getCoursesForDay}
          isEditable={isEditable}
          toggleExpand={toggleExpand}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          confirmEdit={confirmEdit}
          deleteCourse={deleteCourse}
          addCourse={addCourse}
          setDraftCourse={setDraftCourse}
        />

        {/*INFERIOR BUTTONS*/}
        <ButtonsBar
          isEditable={isEditable}
          copyLastWeek={copyLastWeek}
          deleteAll={deleteAll}
          saveWeek={saveWeek}
        />
      </div>

      {/*The modal is for make the possible warnings*/}
      {modal && (
        <Modal
          title={modal.title}
          message={modal.message}
          confirmText={modal.confirmText}
          cancelText={modal.cancelText}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
        />
      )}
    </div>
  );
};

export default TimeCard;
