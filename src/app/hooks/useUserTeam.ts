import { useFetch } from './useFetch';

// Interfaz en base a lo que devuelve /api/users/team
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

/** Cargamos la informacion del equipo al que pertenece el usuario
 *  Se llama a GET /api/users/team
 */
export function useUserTeam() {
  const { data, loading, error } = useFetch<TeamResponse>(
    '/api/users/team'
  );
  return { teamData: data, loading, error };
}