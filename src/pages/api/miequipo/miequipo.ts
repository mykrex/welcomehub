import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const supabaseClient = createPagesServerClient({ req, res });

  const {
    data: { session },
    error: sessionError,
  } = await supabaseClient.auth.getSession();
  if (sessionError || !session) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const userId = session.user.id;

  const { data: usuario, error: userError } = await supabaseServer
    .from("usuario")
    .select("id_equipo")
    .eq("id_usuario", userId)
    .maybeSingle();

  if (userError || !usuario?.id_equipo) {
    return res
      .status(404)
      .json({ error: "Usuario no encontrado o sin equipo asignado" });
  }

  const id_equipo = usuario.id_equipo;

  const { data: equipoData } = await supabaseServer
    .from("equipo_trabajo")
    .select("nombre, id_administrador")
    .eq("id_equipo", id_equipo)
    .maybeSingle();

  const teamName = equipoData?.nombre || "Mi Equipo";
  const idAdministrador = equipoData?.id_administrador;

  const { data: usuarios, error: errorUsuarios } = await supabaseServer
    .from("usuario")
    .select("id_usuario, nombres")
    .eq("id_equipo", id_equipo);

  if (errorUsuarios || !usuarios) {
    return res
      .status(500)
      .json({ error: "Error al obtener usuarios del equipo" });
  }

  const employees = [];

  for (const usuario of usuarios) {
    const { id_usuario, nombres } = usuario;

    const { data: registros } = await supabaseServer
      .from("registro_tiempo")
      .select("hora_entrada, horas_trabajadas")
      .eq("id_usuario", id_usuario);

    const hoursPerDay = Array(7).fill(0);
    registros?.forEach((registro) => {
      const date = new Date(registro.hora_entrada);
      const day = date.getDay();
      if (!isNaN(day)) {
        hoursPerDay[day] += registro.horas_trabajadas || 0;
      }
    });

    const { data: cursos } = await supabaseServer
      .from("curso_usuario")
      .select("estado, id_curso")
      .eq("id_usuario", id_usuario);

    const estadoCursos = {
      completed: 0,
      inProgress: 0,
      notStarted: 0,
    };

    const cursoIds = cursos?.map((c) => c.id_curso) || [];

    cursos?.forEach((curso) => {
      switch (curso.estado) {
        case "completado":
          estadoCursos.completed++;
          break;
        case "en_progreso":
          estadoCursos.inProgress++;
          break;
        case "sin_comenzar":
          estadoCursos.notStarted++;
          break;
      }
    });

    const { data: obligatorios } = await supabaseServer
      .from("curso")
      .select("id_curso, obligatorio")
      .in("id_curso", cursoIds);

    const obligatoriosSet = new Set(
      obligatorios?.filter((c) => c.obligatorio)?.map((c) => c.id_curso)
    );

    const estadoObligatorios = {
      completed: 0,
      inProgress: 0,
      notStarted: 0,
    };

    cursos?.forEach((curso) => {
      if (!obligatoriosSet.has(curso.id_curso)) return;

      switch (curso.estado) {
        case "completado":
          estadoObligatorios.completed++;
          break;
        case "en_progreso":
          estadoObligatorios.inProgress++;
          break;
        case "sin_comenzar":
          estadoObligatorios.notStarted++;
          break;
      }
    });

    let photoUrl = "/placeholder_profile.png";
    const { data: photoData } = await supabaseServer.storage
      .from("avatars")
      .createSignedUrl(`${id_usuario}/profile.png`, 60);

    if (photoData?.signedUrl) {
      photoUrl = photoData.signedUrl;
    }

    employees.push({
      id: id_usuario,
      name: nombres,
      photo: photoUrl,
      hoursPerDay,
      courses: estadoCursos,
      obligatoryCourses: estadoObligatorios,
      isAdmin: id_usuario === idAdministrador,
    });
  }

  const sortedEmployees = employees.sort((a, b) => {
    if (a.isAdmin) return -1;
    if (b.isAdmin) return 1;
    return 0;
  });

  return res.status(200).json({
    teamName,
    employees: sortedEmployees,
  });
}
