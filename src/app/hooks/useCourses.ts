import { useFetch } from './useFetch';

export interface Course {
  id: string;
  title: string;
  description: string;
  status: string;
}

export function useCourses() {
  const { data, loading, error } = useFetch<Course[]>('/api/courses');

  return {
    courses: data,
    loading,
    error,
  };
}
