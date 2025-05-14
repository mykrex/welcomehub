export type BadgeTipo = 'streak' | 'puntos' | 'retos' | 'especial';
export type BadgeCondicionTipo = 'min_streak' | 'min_puntos' | 'retos_completados' | 'primer_reto' | 'otros';

export interface BadgeCondition {
  tipo: BadgeCondicionTipo;
  valor: number;
}

export interface Badge {
  id_badge: number;
  nombre: string;
  descripcion: string;
  icono: string;
  tipo: BadgeTipo;
  condicion: BadgeCondition;
}

export interface BadgeUsuario {
  id_usuario: number;
  id_badge: number;
  fecha_obtenido: string;
}
