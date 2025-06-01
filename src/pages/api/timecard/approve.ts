// src/pages/api/timecard/approve.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get Supabase session
  const supabase = createPagesServerClient({ req, res });
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  // Ensure the user is authenticated
  if (sessionError || !session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const adminId = session.user.id;
  const { id_semana } = req.body;

  // Validate required parameter
  if (!id_semana) {
    return res.status(400).json({ error: "Missing id_semana" });
  }

  // 1. Fetch the week record to be approved
  const { data: semana, error: semanaError } = await supabaseServer
    .from("semana")
    .select("id_usuario")
    .eq("id_semana", id_semana)
    .maybeSingle();

  if (semanaError || !semana) {
    return res.status(404).json({ error: "Week not found" });
  }

  // 2. Get the team ID of the user who owns the week
  const { data: usuario, error: userError } = await supabaseServer
    .from("usuario")
    .select("id_equipo")
    .eq("id_usuario", semana.id_usuario)
    .maybeSingle();

  if (userError || !usuario?.id_equipo) {
    return res.status(500).json({ error: "Failed to fetch user's team" });
  }

  // 3. Check if the requester is the administrator of that team
  const { data: equipo, error: equipoError } = await supabaseServer
    .from("equipo_trabajo")
    .select("id_administrador")
    .eq("id_equipo", usuario.id_equipo)
    .maybeSingle();

  if (equipoError || equipo?.id_administrador !== adminId) {
    return res.status(403).json({ error: "You do not have permission to approve this week" });
  }

  // 4. Update the week's status to "Aprobado" (Approved)
  const { error: updateError } = await supabaseServer
    .from("semana")
    .update({
      estado: "Aprobado",              // Status: Approved
      aprobado_el: new Date().toISOString(), // Timestamp of approval
      aprobado_por: adminId,           // ID of the approver
    })
    .eq("id_semana", id_semana);

  if (updateError) {
    return res.status(500).json({ error: "Failed to approve week" });
  }

  // Success response
  return res.status(200).json({ message: "Week successfully approved" });
}
