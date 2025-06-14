import { useCallback } from "react";
import { Course, CoursesPerDay } from "./useBeforeTC";

type ModalSetter = React.Dispatch<
  React.SetStateAction<{
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>
>;

export const useCourseOptions = (
  tempCourses: { [weekKey: string]: CoursesPerDay },
  setTempCourses: React.Dispatch<
    React.SetStateAction<{ [weekKey: string]: CoursesPerDay }>
  >,
  editing: { [iso: string]: number | null },
  setEditing: React.Dispatch<
    React.SetStateAction<{ [iso: string]: number | null }>
  >,
  draftCourse: { [iso: string]: Course },
  setDraftCourse: React.Dispatch<
    React.SetStateAction<{ [iso: string]: Course }>
  >,
  setModal: ModalSetter,
  weekKey: string
) => {
  const getCoursesForDay = useCallback(
    (iso: string): Course[] => {
      return tempCourses[weekKey]?.[iso] || [];
    },
    [tempCourses, weekKey]
  );

  const startEdit = useCallback(
    (iso: string, index: number, course: Course) => {
      const isEditingNow = Object.values(editing).some((i) => i !== null);
      if (isEditingNow) {
        setModal({
          title: "Advertencia",
          message:
            "Ya estás editando otro proyecto. Termínalo antes de continuar.",
          onConfirm: () => setModal(null),
        });
        return;
      }

      setEditing((prev) => ({ ...prev, [iso]: index }));
      setDraftCourse((prev) => ({ ...prev, [iso]: { ...course } }));
    },
    [editing, setModal, setEditing, setDraftCourse]
  );

  const confirmEdit = useCallback(
    (iso: string, index: number) => {
      const updated = draftCourse[iso];
      if (!updated || !updated.id || updated.title.trim() === "") {
        setModal({
          title: "Error",
          message: "Debes seleccionar un proyecto válido antes de aceptar.",
          onConfirm: () => setModal(null),
        });
        return;
      }

      setTempCourses((prev) => {
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

      setEditing((prev) => ({ ...prev, [iso]: null }));
    },
    [draftCourse, setTempCourses, setEditing, setModal, weekKey]
  );

  const cancelEdit = useCallback(
    (iso: string) => {
      const dayCourses = tempCourses[weekKey]?.[iso] || [];
      if (dayCourses.length > 0) {
        const lastCourse = dayCourses[dayCourses.length - 1];
        if (
          !lastCourse.id &&
          lastCourse.title.trim() === "" &&
          lastCourse.hours === 0
        ) {
          const newCourses = dayCourses.slice(0, -1);
          setTempCourses((prev) => ({
            ...prev,
            [weekKey]: {
              ...prev[weekKey],
              [iso]: newCourses,
            },
          }));
        }
      }
      setEditing((prev) => ({ ...prev, [iso]: null }));
    },
    [tempCourses, setTempCourses, setEditing, weekKey]
  );

  const deleteCourse = useCallback(
    (iso: string, index: number) => {
      const isEditingNow = Object.values(editing).some((i) => i !== null);
      if (isEditingNow) {
        setModal({
          title: "Advertencia",
          message: "No puedes borrar mientras estás editando otro proyecto.",
          onConfirm: () => setModal(null),
        });
        return;
      }

      setTempCourses((prev) => {
        const dayCourses = prev[weekKey]?.[iso] || [];
        const newCourses = [
          ...dayCourses.slice(0, index),
          ...dayCourses.slice(index + 1),
        ];
        return {
          ...prev,
          [weekKey]: {
            ...prev[weekKey],
            [iso]: newCourses,
          },
        };
      });
    },
    [editing, setModal, setTempCourses, weekKey]
  );

  return {
    getCoursesForDay,
    startEdit,
    confirmEdit,
    cancelEdit,
    deleteCourse,
  };
};
