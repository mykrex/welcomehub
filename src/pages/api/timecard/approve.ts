// src/pages/api/timecard/approve.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const supabase = createPagesServerClient({ req, res });
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const adminId = session.user.id;
  const { id_semana } = req.body;

  if (!id_semana) {
    return res.status(400).json({ error: "Falta id_semana" });
  }

  // 1. Obtener la semana
  const { data: semana, error: semanaError } = await supabaseServer
    .from("semana")
    .select("id_usuario")
    .eq("id_semana", id_semana)
    .maybeSingle();

  if (semanaError || !semana) {
    return res.status(404).json({ error: "Semana no encontrada" });
  }

  // 2. Verificar si el usuario que aprueba es administrador del dueño de la semana
  const { data: usuario, error: userError } = await supabaseServer
    .from("usuario")
    .select("id_equipo")
    .eq("id_usuario", semana.id_usuario)
    .maybeSingle();

  if (userError || !usuario?.id_equipo) {
    return res.status(500).json({ error: "Error al verificar equipo del usuario" });
  }

  const { data: equipo, error: equipoError } = await supabaseServer
    .from("equipo_trabajo")
    .select("id_administrador")
    .eq("id_equipo", usuario.id_equipo)
    .maybeSingle();

  if (equipoError || equipo?.id_administrador !== adminId) {
    return res.status(403).json({ error: "No tienes permisos para aprobar esta semana" });
  }

  // 3. Actualizar estado de la semana a "Aprobado"
  const { error: updateError } = await supabaseServer
    .from("semana")
    .update({
      estado: "Aprobado",
      aprobado_el: new Date().toISOString(),
      aprobado_por: adminId,
    })
    .eq("id_semana", id_semana);

  if (updateError) {
    return res.status(500).json({ error: "Error al aprobar semana" });
  }

  return res.status(200).json({ message: "Semana aprobada correctamente" });
}
