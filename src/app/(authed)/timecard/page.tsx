'use client';

import React, {useEffect} from 'react';
import Modal from './Modal';
import { fetchWeekData } from "@/pages/api/timecard/fetchTimeCard";
import './TimeCard.css';
import TimeTable from './TimeTable';
import ButtonsBar from './ButtonsBar';
import CalendarStatus from './CalendarStatus';
import { getWeekFromBaseDate, statusFormatted, CoursesPerDay } from './hooks/usebeforeTimecard';
import { useTimecard } from './hooks/usetimecard';
import { useCourseOptions } from './hooks/usecourseoptions';
import { useAddCourse } from './hooks/useaddcourse';
import { useWeekNavigation } from './hooks/useweeknavigation';
import { useCopyLastWeek } from './hooks/usecopyLastWeek';
import { useSaveWeek } from './hooks/usesaveweekdeleteall';


// Main component for rendering the time card UI
const TimeCard = () => {
  //Here were we create all functions inside useTimeCard
  const {
    startDate, setStartDate,
    week, setWeek,
    tempCourses, setTempCourses,
    savedCourses, setSavedCourses,
    approvedWeeks, setApprovedWeeks,
    weekStates, setWeekStates,
    deliveryDates, setDeliveryDates,
    expanded, setExpanded,
    editing, setEditing,
    draftCourse, setDraftCourse,
    projectOptions, setProjectOptions,
    triggerAutoSave, setTriggerAutoSave,
    modal, setModal,
  } = useTimecard();

  // Runs when the startDate changes, recalculates the week and editing state
  useEffect(() => {
    const result = getWeekFromBaseDate(startDate);
    setWeek(result);
    const initialEditingState: { [iso: string]: number | null } = {};
    result.forEach(day => {
      initialEditingState[day.iso] = null;
    });
    setEditing(initialEditingState);
  }, [startDate, setEditing, setWeek]);

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
  }, [week, setSavedCourses, setApprovedWeeks, setDeliveryDates, setProjectOptions, setTempCourses, setWeekStates]);

  //Here are the buttons of accepting a course, regrecting changes or courses, editing a course
  //Deleting a course and the list of courses for a specific ISO date
  const {
    getCoursesForDay,
    startEdit,
    confirmEdit,
    cancelEdit,
    deleteCourse,
  } = useCourseOptions(
    tempCourses,
    setTempCourses,
    editing,
    setEditing,
    draftCourse,
    setDraftCourse,
    setModal,
    weekKey
  );


  // Adds a new course (empty) to a given day and sets it in editing mode.
  const { addCourse } = useAddCourse({
    weekKey,
    editing,
    setEditing,
    tempCourses,
    setTempCourses,
    setDraftCourse,
    getCoursesForDay,
  });


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
  // And it also toggles the expansion state of a day's section. 
  // Cancels edit if the day is currently being edited.

  const { changeWeek, toggleExpand } = useWeekNavigation({
    week,
    startDate,
    setStartDate,
    editing,
    setModal,
    isWeekClean,
    cancelEdit,
    setExpanded,
  });

  // Copies the previous week's courses into the current week.
  const { copyLastWeek } = useCopyLastWeek({
    editing,
    startDate,
    week,
    weekKey,
    setModal,
    setTempCourses,
    setSavedCourses,
    setTriggerAutoSave,
  });

  // Handles save and delete operations for the current week
  //It also has the function of saving the entire week
  const { deleteAll, saveWeek } = useSaveWeek({
    editing,
    tempCourses,
    setTempCourses,
    savedCourses,
    setSavedCourses,
    approvedWeeks,
    deliveryDates,
    setDeliveryDates,
    setModal,
    week,
    weekKey,
    triggerAutoSave,
    setTriggerAutoSave,
  });

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
