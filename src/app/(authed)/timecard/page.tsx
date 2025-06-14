"use client";

import React, { useEffect } from "react";
import Modal from "../../components/(timecard)/Modal";
import { fetchWeekData } from "@/pages/api/timecard/fetchTimeCard";
import TimeTable from "../../components/(timecard)/TimeTable";
import ButtonsBar from "../../components/(timecard)/ButtonsBar";
import CalendarStatus from "../../components/(timecard)/CalendarStatus";
import {
  getWeekFromBaseDate,
  statusFormatted,
  CoursesPerDay,
} from "../../hooks/useBeforeTC";
import { useTimecard } from "../../hooks/useTimecardTC";
import { useCourseOptions } from "../../hooks/useCourseOptionsTC";
import { useAddCourse } from "../../hooks/useAddCourseTC";
import { useWeekNavigation } from "../../hooks/useWeekNavigationTC";
import { useCopyLastWeek } from "../../hooks/useCopyLastWeekTC";
import { useSaveWeek } from "../../hooks/useSaveWeekDetailsTC";

import "./timecardStyles.css";

const TimeCard = () => {
  const {
    startDate,
    setStartDate,
    week,
    setWeek,
    tempCourses,
    setTempCourses,
    savedCourses,
    setSavedCourses,
    approvedWeeks,
    setApprovedWeeks,
    weekStates,
    setWeekStates,
    deliveryDates,
    setDeliveryDates,
    expanded,
    setExpanded,
    editing,
    setEditing,
    draftCourse,
    setDraftCourse,
    projectOptions,
    setProjectOptions,
    triggerAutoSave,
    setTriggerAutoSave,
    modal,
    setModal,
  } = useTimecard();

  useEffect(() => {
    const result = getWeekFromBaseDate(startDate);
    setWeek(result);
    const initialEditingState: { [iso: string]: number | null } = {};
    result.forEach((day) => {
      initialEditingState[day.iso] = null;
    });
    setEditing(initialEditingState);
  }, [startDate, setEditing, setWeek]);

  const weekKey = week.map((d) => d.iso).join(",");

  const isCurrentWeek = (selectedDate: Date) => {
    const today = new Date();
    const startOfTodayWeek = getWeekFromBaseDate(today)
      .map((d) => d.iso)
      .join(",");
    const startOfSelectedWeek = getWeekFromBaseDate(selectedDate)
      .map((d) => d.iso)
      .join(",");
    return startOfTodayWeek === startOfSelectedWeek;
  };

  const isEditable = isCurrentWeek(startDate);

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
            id: r.proyecto.id_proyecto,
            title: r.proyecto.nombre,
            hours: r.horas,
          });
        }

        const newWeekKey = week.map((d) => d.iso).join(",");

        setWeekStates((prev) => ({
          ...prev,
          [newWeekKey]: semana?.estado || "Abierto",
        }));

        setSavedCourses((prev) => ({ ...prev, [newWeekKey]: grouped }));
        setTempCourses((prev) => ({ ...prev, [newWeekKey]: grouped }));
        setDeliveryDates((prev) => ({
          ...prev,
          [newWeekKey]: semana?.enviado_el || "",
        }));
        setApprovedWeeks((prev) => ({
          ...prev,
          [newWeekKey]: semana?.aprobado_el || null,
        }));

        setProjectOptions(proyectosDisponibles);
      } catch (error) {
        console.error("Error loading data from Supabase:", error);
      }
    };

    loadFromAPI();
  }, [
    week,
    setSavedCourses,
    setApprovedWeeks,
    setDeliveryDates,
    setProjectOptions,
    setTempCourses,
    setWeekStates,
  ]);

  const { getCoursesForDay, startEdit, confirmEdit, cancelEdit, deleteCourse } =
    useCourseOptions(
      tempCourses,
      setTempCourses,
      editing,
      setEditing,
      draftCourse,
      setDraftCourse,
      setModal,
      weekKey
    );

  const { addCourse } = useAddCourse({
    weekKey,
    editing,
    setEditing,
    tempCourses,
    setTempCourses,
    setDraftCourse,
    getCoursesForDay,
  });

  const totalHours = week.reduce((acc, day) => {
    const courses = getCoursesForDay(day.iso);
    return acc + courses.reduce((sum, c) => sum + c.hours, 0);
  }, 0);

  const isWeekClean = (): boolean => {
    const noEditing = Object.values(editing).every((index) => index === null);
    const current = tempCourses[weekKey] || {};
    const saved = savedCourses[weekKey] || {};
    const unchanged = JSON.stringify(current) === JSON.stringify(saved);
    return noEditing && unchanged;
  };

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

  const today = new Date();
  const currentMonth = today.toLocaleString("es-MX", { month: "long" });
  const monthName =
    currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
  const weekNumber = week.length
    ? Math.ceil(
        (week[0].date.getTime() -
          new Date(week[0].date.getFullYear(), 0, 1).getTime()) /
          (1000 * 60 * 60 * 24 * 7)
      )
    : 0;

  return (
    <div className="timecard-container">
      <div className="timecard-box">
        {/* HEADER */}
        <div className="header">
          <button className="nav-btn" onClick={() => changeWeek(-7)}>
            ‹ Periodo Anterior
          </button>
          <h2 className="weekendpayment">
            <strong>Periodo de Pago:</strong> {week[0]?.format} -{" "}
            {week[6]?.format}
          </h2>
          <button className="nav-btn" onClick={() => changeWeek(7)}>
            Siguiente Periodo ›
          </button>
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
