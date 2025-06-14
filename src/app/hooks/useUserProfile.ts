import { useFetch } from './useFetch';

export interface UserProfile {
  id_usuario: string;
  email: string;
  rol: string;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  puesto?: string;
  en_neoris_desde?: string;
  fecha_nacimiento?: string;
}

export function useUserProfile() {
  const { data, loading, error } = useFetch<UserProfile>(
    '/api/users/info'
  );
  return { profile: data, loading, error };
}