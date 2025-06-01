// pages/api/miequipo/approve_week.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseServer } from '@/lib/supabaseServer';

// FUNCION HELPER para obtener la fecha actual en nuestra zona horaria(Mex)
const getMexicoDateTime = (): string => {
  // Crear la fecha en zona horaria de Mex (UTC-6 o UTC-5 segun DST)
  const now = new Date();
  
  // Obtener fecha en zona horaria de Mex
  const mexicoDate = new Date(now.toLocaleString("en-US", {timeZone: "America/Mexico_City"}));
  
  // Convertir a formato ISO pero manteniendo la fecha local
  const year = mexicoDate.getFullYear();
  const month = String(mexicoDate.getMonth() + 1).padStart(2, '0');
  const day = String(mexicoDate.getDate()).padStart(2, '0');
  const hours = String(mexicoDate.getHours()).padStart(2, '0');
  const minutes = String(mexicoDate.getMinutes()).padStart(2, '0');
  const seconds = String(mexicoDate.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const supabaseClient = createPagesServerClient({ req, res });
  const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
  
  if (sessionError || !session) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const { weekId } = req.body;
  
  if (!weekId) {
    return res.status(400).json({ error: 'weekId es requerido' });
  }

  try {
    const userId = session.user.id;

    // Verificar que el usuario es admin del equipo
    const { data: currentUser } = await supabaseServer
      .from('usuario')
      .select('id_equipo')
      .eq('id_usuario', userId)
      .single();

    const { data: team } = await supabaseServer
      .from('equipo_trabajo')
      .select('id_administrador')
      .eq('id_equipo', currentUser?.id_equipo)
      .single();

    if (team?.id_administrador !== userId) {
      return res.status(403).json({ error: 'Solo los administradores pueden aprobar semanas' });
    }

    // Verificar que la semana existe y esta en estado "enviado"
    const { data: week } = await supabaseServer
      .from('semana')
      .select('estado, id_usuario')
      .eq('id_semana', weekId)
      .single();

    if (!week) {
      return res.status(404).json({ error: 'Semana no encontrada' });
    }

    if (week.estado !== 'enviado') {
      return res.status(400).json({ error: 'Solo se pueden aprobar semanas en estado "enviado"' });
    }

    // Verificar que el empleado pertenece al mismo equipo
    const { data: employee } = await supabaseServer
      .from('usuario')
      .select('id_equipo')
      .eq('id_usuario', week.id_usuario)
      .single();

    if (employee?.id_equipo !== currentUser?.id_equipo) {
      return res.status(403).json({ error: 'No puedes aprobar semanas de empleados de otros equipos' });
    }

    // Usar fecha de Mex en lugar de UTC
    const mexicoDateTime = getMexicoDateTime();

    // Aprobar la semana
    const { error: updateError } = await supabaseServer
      .from('semana')
      .update({
        estado: 'aprobado',
        aprobado_por: userId,
        aprobado_el: mexicoDateTime // Usar fecha de Mex
      })
      .eq('id_semana', weekId);

    if (updateError) {
      console.error('Error al actualizar semana:', updateError);
      return res.status(500).json({ error: 'Error al aprobar la semana' });
    }

    return res.status(200).json({ 
      message: 'Semana aprobada exitosamente',
      weekId,
      approvedAt: mexicoDateTime
    });

  } catch (error) {
    console.error('Error en approve-week:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}