import type { CoursesPerDay } from "./useBeforeTC";

type AddCourseProps = {
  weekKey: string;
  editing: { [iso: string]: number | null };
  setEditing: React.Dispatch<
    React.SetStateAction<{ [iso: string]: number | null }>
  >;
  tempCourses: { [weekKey: string]: CoursesPerDay };
  setTempCourses: React.Dispatch<
    React.SetStateAction<{ [weekKey: string]: CoursesPerDay }>
  >;
  setDraftCourse: React.Dispatch<
    React.SetStateAction<{
      [iso: string]: { id: string; title: string; hours: number };
    }>
  >;
  getCoursesForDay: (
    iso: string
  ) => { id: string; title: string; hours: number }[];
};

export function useAddCourse({
  weekKey,
  editing,
  setEditing,
  setTempCourses,
  setDraftCourse,
  getCoursesForDay,
}: AddCourseProps) {
  const addCourse = (iso: string) => {
    if (editing[iso] !== null && editing[iso] !== undefined) return;

    setTempCourses((prev) => {
      const existing = prev[weekKey]?.[iso] || [];
      const newCourses = [...existing, { id: "", title: "", hours: 0 }];

      return {
        ...prev,
        [weekKey]: {
          ...prev[weekKey],
          [iso]: newCourses,
        },
      };
    });

    setEditing((prev) => ({
      ...prev,
      [iso]: getCoursesForDay(iso).length || 0,
    }));

    setDraftCourse((prev) => ({
      ...prev,
      [iso]: { id: "", title: "", hours: 0 },
    }));
  };

  return { addCourse };
}
