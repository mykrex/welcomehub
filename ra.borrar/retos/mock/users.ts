import { Usuario, RetoUsuarioStats } from '../../../../../ra.borrar/types/retoTypes';

export const mockStats: RetoUsuarioStats[] = [
  { id_user: 1, puntos_total: 850, retos_completados_total: 13, streak_actual: 2, streak_record: 5, podios_total: 0 },
  { id_user: 2, puntos_total: 1090, retos_completados_total: 15, streak_actual: 4, streak_record: 4, podios_total: 2 },
  { id_user: 3, puntos_total: 990, retos_completados_total: 12, streak_actual: 3, streak_record: 6, podios_total: 1 },
  { id_user: 4, puntos_total: 900, retos_completados_total: 10, streak_actual: 1, streak_record: 3, podios_total: 0 },
  { id_user: 5, puntos_total: 890, retos_completados_total: 11, streak_actual: 2, streak_record: 3, podios_total: 0 },
  { id_user: 6, puntos_total: 850, retos_completados_total: 9, streak_actual: 2, streak_record: 2, podios_total: 0 },
  { id_user: 7, puntos_total: 700, retos_completados_total: 8, streak_actual: 1, streak_record: 2, podios_total: 0 },
  { id_user: 8, puntos_total: 550, retos_completados_total: 5, streak_actual: 0, streak_record: 1, podios_total: 0 },
  { id_user: 9, puntos_total: 520, retos_completados_total: 3, streak_actual: 0, streak_record: 1, podios_total: 0 },
  { id_user: 10, puntos_total: 300, retos_completados_total: 2, streak_actual: 0, streak_record: 1, podios_total: 0 }
];

export const mockUsuarios: Usuario[] = [
  { 
    id_usuario: 1, 
    nombres: "Gabriel David", 
    apellidos: "Cruz Martinez", 
    imagen: "/Avatars/avatar1.jpg"
  },
  { 
    id_usuario: 2, 
    nombres: "Luis Fernando", 
    apellidos: "Ramírez López",
    imagen: "/Avatars/avatar2.jpg"
  },
  { id_usuario: 3, 
    nombres: "Ana Sofía", //Mujer
    apellidos: "González Vega", 
    imagen: "/Avatars/avatar3.jpg"
  },
  { id_usuario: 4, 
    nombres: "José", 
    apellidos: "Martínez Torres", 
    imagen: "/Avatars/avatar4.jpg"
  },
  { id_usuario: 5, 
    nombres: "Emilio", 
    apellidos: "Sánchez Navarro",
    imagen: "/Avatars/avatar5.jpg"
  },
  { id_usuario: 6, 
    nombres: "María Fernanda", //Mujer
    apellidos: "Pérez Salinas",
    imagen: "/Avatars/avatar6.jpg" 
  },
  { id_usuario: 7, 
    nombres: "Juan Pablo", 
    apellidos: "Domínguez Ruiz",
    imagen: "/Avatars/avatar7.jpg"
  },
  { id_usuario: 8, 
    nombres: "Valeria", //Mujer
    apellidos: "Ramírez Castillo",
    imagen: "/Avatars/avatar8.jpg"
  },
  { id_usuario: 9, 
    nombres: "Diego Alejandro", 
    apellidos: "Rojas Mendoza",
    imagen: "/Avatars/avatar9.jpg"
  },
  { id_usuario: 10, 
    nombres: "Susana", //Mujer
    apellidos: "Padilla Torres",
    imagen: "/Avatars/avatar10.jpg"
  }
];