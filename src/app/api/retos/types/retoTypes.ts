export type TipoReto = 'streak' | 'challenge' | 'target';
export type DuracionReto = 'diario' | 'semanal' | 'mensual';
export type TipoCondicion = 'asistencia' | 'puntos' | 'completados';
export type TipoProgreso = 'streak' | 'challenge' | 'target';

export interface Reto {
  id_reto: number;
  puntos: number;
  descripcion: string;
  tipo_reto: TipoReto;
  duracion: DuracionReto;
}

export interface RetoCondition {
  id_condition: number;
  tipo_condition: TipoCondicion;
  tipo_progreso: TipoProgreso;
  num_meta: number;
}

export interface RetoUsuario {
  id_reto_usuario: number;
  id_usuario: number;
  id_reto: number;
  progreso: number;
  completado: boolean;
  inicio: string;
  fin: string;
}

export interface RetoUsuarioStats {
  id_user: number;
  puntos_total: number;
  retos_completados_total: number;
  streak_actual: number;
  streak_record: number;
  podios_total: number;
}

export interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  imagen: string;
}

export interface RankingEntry {
  id_usuario: number;
  nombre_completo: string;
  puntos: number;
  rank: number;
  imagen: string;
}
