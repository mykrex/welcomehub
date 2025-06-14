import { useFetch } from "./useFetch";

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

export function useUserTeam() {
  const { data, loading, error } = useFetch<TeamResponse>("/api/users/team");
  return { teamData: data, loading, error };
}
