import { useFetch } from './useFetch';

export interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
    status: "complete" | "in_progress" | "not_started"; 
}

export function useCourses() {
  const { data, loading, error } = useFetch<Course[]>('/api/courses');

  const recentCourse = data && data.length > 0 ? data[0] : null;

  return {
    courses: data || [],
    recentCourse,
    loading,
    error,
  };
}
