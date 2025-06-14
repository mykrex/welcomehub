import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = createPagesServerClient({ req, res });
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const id_usuario = session.user.id;
  const { inicioSemana } = req.query;

  if (!inicioSemana || typeof inicioSemana !== "string") {
    return res.status(400).json({ error: "Missing 'inicioSemana' parameter" });
  }

  const { data: semana, error: semanaError } = await supabaseServer
    .from("semana")
    .select(
      "id_semana, id_usuario, inicio_semana, fin_semana, estado, enviado_el, aprobado_el, aprobado_por, horas_totales"
    )
    .eq("id_usuario", id_usuario)
    .eq("inicio_semana", inicioSemana)
    .maybeSingle();

  if (semanaError) {
    return res.status(500).json({ error: "Error fetching week" });
  }

  if (!semana) {
    return res
      .status(200)
      .json({ semana: null, registros: [], proyectosDisponibles: [] });
  }

  const id_semana = semana.id_semana;

  const { data: registros, error: horasError } = await supabaseServer
    .from("horas")
    .select("id_horas, id_proyecto, fecha_trabajada, horas")
    .eq("id_semana", id_semana);

  if (horasError) {
    return res.status(500).json({ error: "Error retrieving hour records" });
  }

  const { data: disponibles, error: proyectosError } = await supabaseServer
    .from("proyecto_usuario")
    .select("id_proyecto")
    .eq("id_usuario", id_usuario);

  if (proyectosError) {
    return res
      .status(500)
      .json({ error: "Error retrieving available projects" });
  }

  const ids = disponibles.map((d) => d.id_proyecto);

  let proyectos: { id_proyecto: string; nombre: string }[] = [];
  if (ids.length > 0) {
    const { data: proyectosData, error: nombresError } = await supabaseServer
      .from("proyecto")
      .select("id_proyecto, nombre")
      .in("id_proyecto", ids);

    if (nombresError) {
      return res.status(500).json({ error: "Error fetching project names" });
    }

    proyectos = proyectosData || [];
  }

  const registrosConNombre = registros.map((r) => ({
    id_horas: r.id_horas,
    fecha_trabajada: r.fecha_trabajada,
    horas: r.horas,
    proyecto: {
      id_proyecto: r.id_proyecto,
      nombre:
        proyectos.find((p) => p.id_proyecto === r.id_proyecto)?.nombre || "",
    },
  }));

  const proyectosDisponibles = proyectos.map((p) => ({
    id_proyecto: p.id_proyecto,
    nombre: p.nombre,
  }));

  return res.status(200).json({
    semana,
    registros: registrosConNombre,
    proyectosDisponibles,
  });
}
