import { useFetch } from './useFetch';

export interface Progress {
  courseId: string;
  completed: number;
  remaining: number;
}

export function useProgress() {
  const { data, loading, error } = useFetch<Progress[]>('/api/progress');

  return {
    progress: data,
    loading,
    error,
  };
}
