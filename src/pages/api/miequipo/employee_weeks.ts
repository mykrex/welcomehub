// pages/api/miequipo/employee_weeks.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseServer } from '@/lib/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const supabaseClient = createPagesServerClient({ req, res });
  const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
  
  if (sessionError || !session) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const { employeeId } = req.query;
  
  if (!employeeId) {
    return res.status(400).json({ error: 'employeeId es requerido' });
  }

  try {
    // Verificar que el usuario tiene acceso al empleado (mismo equipo o es admin)
    const userId = session.user.id;
    
    const { data: currentUser } = await supabaseServer
      .from('usuario')
      .select('id_equipo')
      .eq('id_usuario', userId)
      .single();

    const { data: targetEmployee } = await supabaseServer
      .from('usuario')
      .select('id_equipo')
      .eq('id_usuario', employeeId)
      .single();

    if (currentUser?.id_equipo !== targetEmployee?.id_equipo) {
      return res.status(403).json({ error: 'No tienes acceso a este empleado' });
    }

    // Obtener las últimas 8 semanas (incluyendo la actual)
    const { data: weeks, error: weeksError } = await supabaseServer
      .from('semana')
      .select(`
        id_semana,
        id_usuario,
        inicio_semana,
        fin_semana,
        enviado_el,
        estado,
        aprobado_por,
        aprobado_el,
        horas_totales
      `)
      .eq('id_usuario', employeeId)
      .order('inicio_semana', { ascending: false })
      .limit(8);

    if (weeksError) {
      return res.status(500).json({ error: 'Error al obtener semanas' });
    }

    // Obtener proyectos disponibles para el empleado (similar a timecard/obtain.ts)
    const { data: disponibles, error: proyectosError } = await supabaseServer
      .from("proyecto_usuario")
      .select("id_proyecto")
      .eq("id_usuario", employeeId);

    if (proyectosError) {
      return res.status(500).json({ error: "Error al obtener proyectos disponibles" });
    }

    const ids = disponibles?.map(d => d.id_proyecto) || [];
    let proyectos: { id_proyecto: string; nombre: string }[] = [];

    if (ids.length > 0) {
      const { data: proyectosData, error: nombresError } = await supabaseServer
        .from("proyecto")
        .select("id_proyecto, nombre")
        .in("id_proyecto", ids);

      if (nombresError) {
        return res.status(500).json({ error: "Error al obtener nombres de proyectos" });
      }
      proyectos = proyectosData || [];
    }

    // Para cada semana, obtener las horas detalladas (siguiendo la logica de timecard)
    const weeksWithHours = await Promise.all(
      (weeks || []).map(async (week) => {
        // Traer registros de horas sin join (como en timecard/obtain.ts)
        const { data: registros, error: horasError } = await supabaseServer
          .from("horas")
          .select("id_horas, id_proyecto, fecha_trabajada, horas")
          .eq("id_semana", week.id_semana);

        if (horasError) {
          console.error('Error al obtener horas:', horasError);
          return { ...week, dias: [] };
        }

        // Unir nombre al registro de horas (como en timecard/obtain.ts)
        const registrosConNombre = (registros || []).map(r => ({
          id_horas: r.id_horas,
          fecha_trabajada: r.fecha_trabajada,
          horas: r.horas,
          proyecto: {
            id_proyecto: r.id_proyecto,
            nombre: proyectos.find(p => p.id_proyecto === r.id_proyecto)?.nombre || `Proyecto ${r.id_proyecto}`,
          }
        }));

        // Agrupar horas por dia
        const daysMap = new Map();
        
        registrosConNombre.forEach(registro => {
          const dateKey = registro.fecha_trabajada;
          
          if (!daysMap.has(dateKey)) {
            daysMap.set(dateKey, {
              fecha_trabajada: dateKey,
              proyectos: [],
              total_horas: 0
            });
          }
          
          const day = daysMap.get(dateKey);
          day.proyectos.push({
            id_proyecto: registro.proyecto.id_proyecto,
            nombre_proyecto: registro.proyecto.nombre,
            horas: registro.horas
          });
          day.total_horas += registro.horas;
        });

        return {
          ...week,
          dias: Array.from(daysMap.values())
        };
      })
    );

    return res.status(200).json({
      weeks: weeksWithHours,
      proyectosDisponibles: proyectos.map(p => ({
        id_proyecto: p.id_proyecto,
        nombre: p.nombre
      }))
    });

  } catch (error) {
    console.error('Error en employee-weeks:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}