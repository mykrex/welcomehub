import { useFetch } from './useFetch';

// Interfaz según lo que devuelve tu /api/users/team
export interface RawMiembro {
  nombres: string;
  apellidos: string;
  email: string;
  puesto: string;
}

export interface TeamResponse {
  equipo: string;
  administrador: string;
  miembros: RawMiembro[];
}

/**
 * Hook específico para cargar la información del equipo del usuario.
 * Llama a GET /api/users/team.
 */
export function useUserTeam() {
  const { data, loading, error } = useFetch<TeamResponse>(
    '/api/users/team'
  );
  return {
    teamData: data,
    loading,
    error,
  };
}