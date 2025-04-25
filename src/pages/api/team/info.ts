import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end("Method not allowed");

  const email = req.query.email as string;
  if (!email) return res.status(400).json({ error: "Email requerido" });

  // Obtener el id_equipo del usuario
  const { data: usuario, error: userError } = await supabase
    .from("usuario")
    .select("id_equipo")
    .eq("email", email)
    .maybeSingle();

  if (userError || !usuario?.id_equipo) {
    return res.status(404).json({ error: "Usuario no encontrado o sin equipo asignado" });
  }

  const id_equipo = usuario.id_equipo;
  
  // Obtener datos del equipo
  const { data: equipo, error: equipoError } = await supabase
    .from("equipo_trabajo")
    .select("nombre, id_administrador")
    .eq("id_equipo", id_equipo)
    .maybeSingle();

  if (equipoError || !equipo) {
    return res.status(404).json({ error: "Equipo no encontrado" });
  }

  // Obtener el email del administrador
  const { data: adminUser, error: adminError } = await supabase
    .from("administrador_usuario")
    .select("id_administrador")
    .eq("id_administrador", equipo.id_administrador)
    .maybeSingle();

  if (adminError || !adminUser) {
    return res.status(404).json({ error: "Administrador no encontrado" });
  }

  const { data: adminEmailData, error: emailError } = await supabase
    .from("usuario")
    .select("email")
    .eq("id_usuario", adminUser.id_administrador)
    .maybeSingle();

  if (emailError || !adminEmailData) {
    return res.status(404).json({ error: "Correo del administrador no encontrado" });
  }

  // Obtener miembros del equipo
  const { data: miembros, error: miembrosError } = await supabase
    .from("usuario")
    .select("nombres, apellidos, email, puesto")
    .eq("id_equipo", id_equipo);

  if (miembrosError) {
    return res.status(500).json({ error: "Error al obtener miembros" });
  }

  return res.status(200).json({
    equipo: equipo.nombre,
    administrador: adminEmailData.email,
    miembros,
  });
}
