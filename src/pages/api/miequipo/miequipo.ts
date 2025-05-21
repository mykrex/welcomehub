// src/pages/api/miequipo/miequipo.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from '@/lib/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    //Authentication User
    const token = req.cookies['sb-access-token'];
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    const { data: userData, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !userData.user) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const userId = userData.user.id;

    //id_equipo from the user
    const { data: usuario, error: userError } = await supabaseServer
      .from("usuario")
      .select("id_equipo")
      .eq("id_usuario", userId)
      .maybeSingle();

    if (userError || !usuario?.id_equipo) {
      return res.status(404).json({ error: "Usuario no encontrado o sin equipo asignado" });
    }

    const id_equipo = usuario.id_equipo;

    //members of the team
    const { data: usuarios, error: errorUsuarios } = await supabaseServer
      .from('usuario')
      .select('id_usuario, nombres')
      .eq('id_equipo', id_equipo);

    if (errorUsuarios || !usuarios) {
      return res.status(500).json({ error: 'Error al obtener usuarios del equipo' });
    }

    const employees = [];

    for (const usuario of usuarios) {
      //Register of time
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

      //Courses
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

      //User profile
      const { data: photoData } = await supabaseServer
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

    //Name of team
    const { data: equipoData } = await supabaseServer
      .from('equipo_trabajo')
      .select('nombre')
      .eq('id_equipo', id_equipo)
      .maybeSingle();

    const teamName = equipoData?.nombre || 'Mi equipo';

    return res.status(200).json({
      teamName,
      employees,
    });
  } catch (error) {
    console.error('Error en API /miequipo:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// src/pages/api/miequipo/miequipo.ts
/*
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from '@/lib/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { data: usuarios, error: errorUsuarios } = await supabaseServer
      .from('usuario')
      .select('id_usuario, nombres'); // 👈 FOTO QUITADA

    if (errorUsuarios || !usuarios) throw errorUsuarios || new Error('No se pudieron obtener los usuarios');

    const employees = [];

    for (const usuario of usuarios) {
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

      employees.push({
        id: usuario.id_usuario,
        name: usuario.nombres,
        hoursPerDay,
        courses: estadoCursos,
        // photo: null, // puedes dejar esto por si luego la agregas
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