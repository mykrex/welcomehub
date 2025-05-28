// src/pages/api/miequipo/miequipo.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseServer } from '@/lib/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  //COOKIES
  const supabaseClient = createPagesServerClient({ req, res });

  const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
  if (sessionError || !session) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const userId = session.user.id;

  // ID FROM THE TEAM OF USER AUTHENTICADED
  const { data: usuario, error: userError } = await supabaseServer
    .from('usuario')
    .select('id_equipo')
    .eq('id_usuario', userId)
    .maybeSingle();

  if (userError || !usuario?.id_equipo) {
    return res.status(404).json({ error: 'Usuario no encontrado o sin equipo asignado' });
  }

  const id_equipo = usuario.id_equipo;

  // OBTAIN THE TEAM NAME AND ADMINISTRATOR
  const { data: equipoData } = await supabaseServer
    .from('equipo_trabajo')
    .select('nombre, id_administrador')
    .eq('id_equipo', id_equipo)
    .maybeSingle();

  const teamName = equipoData?.nombre || 'Mi Equipo';
  const idAdministrador = equipoData?.id_administrador;

  //OBTAIN USERS FROM THE TEAM
  const { data: usuarios, error: errorUsuarios } = await supabaseServer
    .from('usuario')
    .select('id_usuario, nombres')
    .eq('id_equipo', id_equipo);

  if (errorUsuarios || !usuarios) {
    return res.status(500).json({ error: 'Error al obtener usuarios del equipo' });
  }

  const employees = [];

  for (const usuario of usuarios) {
    const { id_usuario, nombres } = usuario;

    //TIME OF THE MEMBERS
    const { data: registros } = await supabaseServer
      .from('registro_tiempo')
      .select('hora_entrada, horas_trabajadas')
      .eq('id_usuario', id_usuario);

    const hoursPerDay = Array(7).fill(0);
    registros?.forEach((registro) => {
      const date = new Date(registro.hora_entrada);
      const day = date.getDay();
      if (!isNaN(day)) {
        hoursPerDay[day] += registro.horas_trabajadas || 0;
      }
    });

    //OBTAIN STATUS FROM THE COURSES
    const { data: cursos } = await supabaseServer
      .from('curso_usuario')
      .select('estado')
      .eq('id_usuario', id_usuario);

    const estadoCursos = {
      completed: 0,
      inProgress: 0,
      incomplete: 0,
      notStarted: 0,
    };

    cursos?.forEach((curso) => {
      switch (curso.estado) {
        case 'completado':
          estadoCursos.completed++;
          break;
        case 'en_progreso':
          estadoCursos.inProgress++;
          break;
        case 'incompleto':
          estadoCursos.incomplete++;
          break;
        case 'no_iniciado':
          estadoCursos.notStarted++;
          break;
      }
    });

    //PHOTO FOR SUPABASE STORAGE
    let photoUrl = '/placeholder_profile.png';
    const { data: photoData } = await supabaseServer
      .storage
      .from('avatars')
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
      isAdmin: id_usuario === idAdministrador,
    });
  }

  //PUT ADMIN FIRST
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


/*import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from '@/lib/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { data: usuarios, error: errorUsuarios } = await supabaseServer
      .from('usuario')
      .select('id_usuario, nombres');

    if (errorUsuarios || !usuarios) throw errorUsuarios || new Error('No se pudieron obtener los usuarios');

    const employees = [];

    for (const usuario of usuarios) {
      // Obtener registros de tiempo
      const { data: registros, error: errorReg } = await supabaseServer
        .from('registro_tiempo')
        .select('hora_entrada, horas_trabajadas')
        .eq('id_usuario', usuario.id_usuario);

      if (errorReg) throw errorReg;

      const hoursPerDay = Array(7).fill(0);
      registros?.forEach((registro) => {
        const day = new Date(registro.hora_entrada).getDay(); // 0 = domingo
        hoursPerDay[day] += registro.horas_trabajadas || 0;
      });

      // Obtener estado de cursos
      const { data: cursos, error: errorCursos } = await supabaseServer
        .from('curso_usuario')
        .select('estado')
        .eq('id_usuario', usuario.id_usuario);

      if (errorCursos) throw errorCursos;

      const estadoCursos = {
        completed: 0,
        inProgress: 0,
        incomplete: 0,
        notStarted: 0,
      };

      cursos?.forEach((curso) => {
        switch (curso.estado) {
          case 'completado':
            estadoCursos.completed++;
            break;
          case 'en_progreso':
            estadoCursos.inProgress++;
            break;
          case 'incompleto':
            estadoCursos.incomplete++;
            break;
          case 'no_iniciado':
            estadoCursos.notStarted++;
            break;
        }
      });

      // Obtener foto firmada desde Supabase Storage
      const { data: photoData, error: photoError } = await supabaseServer
        .storage
        .from('avatars')
        .createSignedUrl(`${usuario.id_usuario}/profile.png`, 60);

      const photoUrl = photoData?.signedUrl || '/placeholder_profile.png';

      employees.push({
        id: usuario.id_usuario,
        name: usuario.nombres,
        photo: photoUrl,
        hoursPerDay,
        courses: estadoCursos,
      });
    }

    const { data: equipoData, error: equipoError } = await supabaseServer
      .from('equipo_trabajo')
      .select('nombre')
      .limit(1)
      .maybeSingle();

    const teamName = equipoData?.nombre || 'Mi Equipo';

    return res.status(200).json({
      teamName,
      employees,
    });
  } catch (error) {
    console.error('Error en API /miequipo:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

*/