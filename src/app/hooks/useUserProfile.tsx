import { useFetch } from './useFetch';

// Define la forma de tu perfil, copia de la tabla `usuario`
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

/**
 * Hook específico para cargar el perfil del usuario autenticado.
 * Llama a GET /api/users/info.
 */
export function useUserProfile() {
  const { data, loading, error } = useFetch<UserProfile>(
    '/api/users/info'
  );
  return {
    profile: data,
    loading,
    error,
  };
}