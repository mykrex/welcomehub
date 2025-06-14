import { useFetch } from "./useFetch";

export interface Progress {
  courseId: string;
  completed: number;
  remaining: number;
}

export function useProgress() {
  const { data, loading, error } = useFetch<Progress[]>("/api/progress");

  const totalCourses = data?.length || 0;
  const totalCompleted = data?.reduce((acc, p) => acc + p.completed, 0) || 0;
  const totalRemaining = data?.reduce((acc, p) => acc + p.remaining, 0) || 0;

  const completionPercentage =
    totalCourses > 0
      ? Math.round((totalCompleted / (totalCompleted + totalRemaining)) * 100)
      : 0;

  const averageTime =
    totalCourses > 0
      ? Math.round((totalCompleted * 5 + totalRemaining * 2) / totalCourses)
      : 0;

  const totalAttempts = totalCompleted + totalRemaining;

  return {
    completionPercentage,
    averageTime,
    totalAttempts,
    loading,
    error,
  };
}
