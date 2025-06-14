import { useState } from "react";
import { Course, DayOfWeek, CoursesPerDay } from "./useBeforeTC";

type ProjectOption = { id_proyecto: string; nombre: string };

type ModalState = null | {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export const useTimecard = () => {
  const [startDate, setStartDate] = useState(new Date());

  const [week, setWeek] = useState<DayOfWeek[]>([]);

  const [tempCourses, setTempCourses] = useState<{
    [weekKey: string]: CoursesPerDay;
  }>({});

  const [savedCourses, setSavedCourses] = useState<{
    [weekKey: string]: CoursesPerDay;
  }>({});

  const [approvedWeeks, setApprovedWeeks] = useState<{
    [weekKey: string]: string | null;
  }>({});

  const [weekStates, setWeekStates] = useState<{ [weekKey: string]: string }>(
    {}
  );

  const [deliveryDates, setDeliveryDates] = useState<{
    [weekKey: string]: string;
  }>({});

  const [expanded, setExpanded] = useState<{ [index: number]: boolean }>({});

  const [editing, setEditing] = useState<{ [iso: string]: number | null }>({});

  const [draftCourse, setDraftCourse] = useState<{ [iso: string]: Course }>({});

  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([]);

  const [triggerAutoSave, setTriggerAutoSave] = useState(false);

  const [modal, setModal] = useState<ModalState>(null);

  return {
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
  };
};
