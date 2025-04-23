import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end("Método no permitido");

  const email = req.query.email as string;

  if (!email) return res.status(400).json({ error: "Email requerido" });

  const { data: usuario, error: userError } = await supabase
    .from("usuario")
    .select("id_equipo")
    .eq("email", email)
    .single();

  if (userError || !usuario?.id_equipo)
    return res.status(404).json({ error: "Usuario o equipo no encontrado" });

  const { data: equipo, error: equipoError } = await supabase
    .from("equipo_trabajo")
    .select("nombre, id_administrador")
    .eq("id_equipo", usuario.id_equipo)
    .single();

  if (equipoError || !equipo)
    return res.status(404).json({ error: "Equipo no encontrado" });

  const { data: miembros, error: miembrosError } = await supabase
    .from("usuario")
    .select("nombres, apellidos, email, rol")
    .eq("id_equipo", usuario.id_equipo);

  if (miembrosError)
    return res.status(500).json({ error: "Error al obtener miembros" });

  return res.status(200).json({
    equipo: equipo.nombre,
    administrador: equipo.id_administrador,
    miembros,
  });
}
