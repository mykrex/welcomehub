//./hooks/usetimecard.ts
//All functions for the timecard
import { useState } from 'react';
import { Course, DayOfWeek, CoursesPerDay } from './useBeforeTC';

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
  // Date of the current week's Monday
  const [startDate, setStartDate] = useState(new Date());

  // Days of the current week (Monday to Sunday)
  const [week, setWeek] = useState<DayOfWeek[]>([]);

  // Courses in temporary (unsaved) state, indexed by week key
  const [tempCourses, setTempCourses] = useState<{ [weekKey: string]: CoursesPerDay }>({});

  // Courses that have been saved (not drafts), indexed by week key
  const [savedCourses, setSavedCourses] = useState<{ [weekKey: string]: CoursesPerDay }>({});

  // Approved weeks and their status
  const [approvedWeeks, setApprovedWeeks] = useState<{ [weekKey: string]: string | null }>({});

  // Status of each week (Open, Sent, Approved)
  const [weekStates, setWeekStates] = useState<{ [weekKey: string]: string }>({});

  // Delivery deadlines per week
  const [deliveryDates, setDeliveryDates] = useState<{ [weekKey: string]: string }>({});

  // Tracks which days have their project list expanded
  const [expanded, setExpanded] = useState<{ [index: number]: boolean }>({});

  // Tracks which course is currently being edited
  const [editing, setEditing] = useState<{ [iso: string]: number | null }>({});

  // Draft course being edited per day
  const [draftCourse, setDraftCourse] = useState<{ [iso: string]: Course }>({});

  // Available project options to select from
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([]);

  // Flag to trigger autosave functionality
  const [triggerAutoSave, setTriggerAutoSave] = useState(false);

  // Modal dialog state for confirmations/warnings
  const [modal, setModal] = useState<ModalState>(null);

  return {
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
  };
};
