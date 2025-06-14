import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseServer } from "@/lib/supabaseServer";
import { v4 as uuidv4 } from "uuid";

interface Course {
  title: string;
  hours: number;
}

interface CoursesPerDay {
  [iso: string]: Course[];
}

interface Day {
  iso: string;
}

interface RegistroHora {
  id_horas: string;
  id_proyecto: string;
  id_semana: string;
  fecha_trabajada: string;
  horas: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = createPagesServerClient({ req, res });
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.id;

  const {
    week,
    coursesPerDay,
    deliveryDate,
    approvedDate,
    approvedBy,
  }: {
    week: Day[];
    coursesPerDay: CoursesPerDay;
    deliveryDate?: string | null;
    approvedDate?: string | null;
    approvedBy?: string | null;
  } = req.body;

  console.log("Incoming save data:", {
    week,
    deliveryDate,
    approvedDate,
    coursesPerDay,
  });

  if (!week || !Array.isArray(week) || week.length !== 7 || !coursesPerDay) {
    return res
      .status(400)
      .json({ error: "Incomplete or incorrectly formatted data" });
  }

  const inicio_semana = week[0].iso;
  const fin_semana = week[6].iso;
  const estado = deliveryDate ? "enviado" : "abierto";

  const horas_totales = Object.values(coursesPerDay)
    .flat()
    .reduce((acc: number, item: Course) => acc + item.hours, 0);

  const { data: usuario } = await supabaseServer
    .from("usuario")
    .select("id_equipo")
    .eq("id_usuario", userId)
    .maybeSingle();

  let aprobado_por = approvedBy || null;

  if (usuario?.id_equipo) {
    const { data: equipoData } = await supabaseServer
      .from("equipo_trabajo")
      .select("id_administrador")
      .eq("id_equipo", usuario.id_equipo)
      .maybeSingle();

    if (equipoData?.id_administrador === userId) {
      aprobado_por = userId;
    }
  }

  const { data: existingWeek } = await supabaseServer
    .from("semana")
    .select("id_semana")
    .eq("id_usuario", userId)
    .eq("inicio_semana", inicio_semana)
    .eq("fin_semana", fin_semana)
    .maybeSingle();

  const id_semana = existingWeek?.id_semana || uuidv4();

  if (deliveryDate || approvedDate) {
    const { error: insertWeekError } = await supabaseServer
      .from("semana")
      .upsert({
        id_semana,
        id_usuario: userId,
        inicio_semana,
        fin_semana,
        estado,
        enviado_el: deliveryDate || null,
        aprobado_el: approvedDate || null,
        aprobado_por,
        horas_totales,
      });

    if (insertWeekError) {
      console.error("Error saving week:", insertWeekError);
      return res.status(500).json({ error: "Error saving week" });
    }
  } else if (!existingWeek) {
    const { error: insertEmptyWeekError } = await supabaseServer
      .from("semana")
      .insert({
        id_semana,
        id_usuario: userId,
        inicio_semana,
        fin_semana,
        estado: "No entregado",
        horas_totales,
      });

    if (insertEmptyWeekError) {
      console.error(
        "Error saving non-submitted week:",
        insertEmptyWeekError
      );
      return res.status(500).json({ error: "Error saving unsubmitted week" });
    }
  }

  await supabaseServer.from("horas").delete().eq("id_semana", id_semana);

  const horas: RegistroHora[] = [];

  for (const [fecha_trabajada, cursos] of Object.entries(coursesPerDay)) {
    const fecha = new Date(fecha_trabajada);
    fecha.setHours(0, 0, 0, 0);
    (cursos as Course[]).forEach((curso: Course) => {
      horas.push({
        id_horas: uuidv4(),
        id_proyecto: curso.title,
        id_semana,
        fecha_trabajada,
        horas: curso.hours,
      });
    });
  }

  const { error: insertHorasError } = await supabaseServer
    .from("horas")
    .insert(horas);

  if (insertHorasError) {
    console.error("Error saving hour records:", insertHorasError);
    return res.status(500).json({ error: "Error saving hour records" });
  }

  return res
    .status(200)
    .json({ message: "Week saved successfully", id_semana });
}
