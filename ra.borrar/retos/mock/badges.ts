import { Badge } from '../../../../../ra.borrar/types/badgeTypes';

export const mockBadges: Badge[] = [
  {
    id_badge: 1,
    nombre: "Bienvenida Estelar",
    descripcion: "Iniciar sesión con WelcomeHub",
    icono: "default",
    tipo: "especial",
    condicion: { tipo: "primer_reto", valor: 1 }
  },
  {
    id_badge: 2,
    nombre: "Explorador Curioso",
    descripcion: "Terminar un curso no asignado",
    icono: "gold",
    tipo: "retos",
    condicion: { tipo: "retos_completados", valor: 1 }
  },
  {
    id_badge: 3,
    nombre: "Progreso Continuo",
    descripcion: "Completar 10 retos",
    icono: "red",
    tipo: "retos",
    condicion: { tipo: "retos_completados", valor: 10 }
  }
];
