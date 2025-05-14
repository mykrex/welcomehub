import { RetoUsuario } from "../types/retoTypes";

export const mockRetoUsuarios: RetoUsuario[] = [
  {
    id_reto_usuario: 1,
    id_usuario: 1,
    id_reto: 1,
    progreso: 5,
    completado: true,
    inicio: "2025-05-01",
    fin: "2025-05-05"
  },
  {
    id_reto_usuario: 2,
    id_usuario: 1,
    id_reto: 2,
    progreso: 0.63,
    completado: false,
    inicio: "2025-05-01",
    fin: "2025-05-07"
  },
  {
    id_reto_usuario: 3,
    id_usuario: 1,
    id_reto: 3,
    progreso: 0,
    completado: false,
    inicio: "2025-05-01",
    fin: "2025-05-07"
  }
];
