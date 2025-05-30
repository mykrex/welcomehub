// src/pages/api/miequipo/semanas.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

interface Breakdown {
  [isoDate: string]: { [id_proyecto: number]: number };
}

interface SemanaData {
  id_semana: number;
  inicio: string;    // ISO date
  fin: string;       // ISO date
  estado: "enviado" | "aprobado";
  enviado_el?: string;
  aprobado_el?: string;
  breakdown: Breakdown;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Autenticamos la sesion del usuario
  const supabase = createPagesServerClient({ req, res });

  const { data: { session }, error: sessErr } = await supabase.auth.getSession();
  
  if (sessErr || !session) return res.status(401).json({ error: 'No autorizado' });

  const userId = session.user.id;

  // Ruta PATCH: aprobar semana
  if (req.method === "PATCH") {
    const { id } = req.query;
    const semanaId = Number(id);
    if (isNaN(semanaId)) {
      return res.status(400).json({ error: "ID de semana inválido" });
    }
    // Solo permitimos aprobar si la semana viene en estado “enviado”
    const { error: updError } = await supabase
      .from("semana")
      .update({
        estado: "aprobado",
        aprobado_por: userId,
        aprobado_el: new Date().toISOString(),
      })
      .eq("id_semana", semanaId)
      .eq("id_usuario", userId)
      .eq("estado", "enviado");

    if (updError) {
      return res.status(500).json({ error: "Error al aprobar semana" });
    }
    return res.status(200).json({ message: "Semana aprobada" });
  }

  // Ruta GET: obtener semanas y sus desgloses
  if (req.method === "GET") {
    // Obtener todas las semanas del usuario
    const { data: weeks, error: weeksError } = await supabase
      .from("semana")
      .select("id_semana, inicio_semana, fin_semana, estado, enviado_el, aprobado_el")
      .eq("id_usuario", userId)
      .order("inicio_semana", { ascending: false });

    if (weeksError) {
      return res.status(500).json({ error: "Error al leer semanas" });
    }

    const result: SemanaData[] = [];

    // Para cada semana leer las horas y agruparlas
    for (const w of weeks) {
      const { id_semana, inicio_semana, fin_semana, estado, enviado_el, aprobado_el } = w;

      const { data: hours, error: hoursError } = await supabase
        .from("horas")
        .select("id_proyecto, fecha_trabajada, horas")
        .eq("id_semana", id_semana);

      if (hoursError) {
        return res.status(500).json({ error: "Error al leer horas de la semana " + id_semana });
      }

      const breakdown: Breakdown = {};

      hours?.forEach(({ id_proyecto, fecha_trabajada, horas }) => {
        const iso = fecha_trabajada!.toString().split("T")[0];
        if (!breakdown[iso]) breakdown[iso] = {};
        breakdown[iso][id_proyecto!] = (breakdown[iso][id_proyecto!] || 0) + (horas || 0);
      });

      result.push({
        id_semana,
        inicio: inicio_semana!,
        fin: fin_semana!,
        estado: estado as "enviado" | "aprobado",
        enviado_el: enviado_el || null,
        aprobado_el: aprobado_el || null,
        breakdown,
      });
    }

    return res.status(200).json(result);
  }

  // Metodo no permitido
  res.setHeader("Allow", ["GET", "PATCH"]);
  return res.status(405).end(`Método ${req.method} no permitido`);
}