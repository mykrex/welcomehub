import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end("Method not allowed");

  const token = req.cookies['sb-access-token'];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  const { data: userData, error: authError } = await supabaseServer.auth.getUser(token);
  if (authError || !userData?.user) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const userId = userData.user.id;

  // Obtener al usuario para su id_equipo y email
  const { data: usuario, error: userError } = await supabaseServer
    .from("usuario")
    .select("id_equipo, email")
    .eq("id_usuario", userId)
    .maybeSingle();

  if (userError || !usuario?.id_equipo) {
    return res.status(404).json({ error: "Usuario no encontrado o sin equipo asignado" });
  }

  const id_equipo = usuario.id_equipo;

  // Obtener datos del equipo
  const { data: equipo, error: equipoError } = await supabaseServer
    .from("equipo_trabajo")
    .select("nombre, id_administrador")
    .eq("id_equipo", id_equipo)
    .maybeSingle();

  if (equipoError || !equipo) {
    return res.status(404).json({ error: "Equipo no encontrado" });
  }

  // Obtener email del administrador (sin importar si el usuario actual lo es o no)
  const { data: adminUsuario, error: adminError } = await supabaseServer
    .from("usuario")
    .select("email")
    .eq("id_usuario", equipo.id_administrador)
    .maybeSingle();

  if (adminError || !adminUsuario?.email) {
    return res.status(404).json({ error: "Correo del administrador no encontrado" });
  }

  // Obtener miembros del equipo
  const { data: miembros, error: miembrosError } = await supabaseServer
    .from("usuario")
    .select("nombres, apellidos, email, puesto")
    .eq("id_equipo", id_equipo);

  if (miembrosError) {
    return res.status(500).json({ error: "Error al obtener miembros" });
  }

  return res.status(200).json({
    equipo: equipo.nombre,
    administrador: adminUsuario.email,
    miembros,
  });
}