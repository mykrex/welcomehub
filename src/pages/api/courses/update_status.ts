import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

interface UpdateStatusRequest {
  id_curso: string;
  nuevo_estado: 'sin_comenzar' | 'en_progreso' | 'completado';
}

type Data = { success: boolean; message: string } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'PUT') return res.status(405).end('Method not allowed');

  const supabase = createPagesServerClient({ req, res });
  
  const { data: { session }, error: sessErr } = await supabase.auth.getSession();
  
  if (sessErr || !session) return res.status(401).json({ error: 'No autorizado' });

  const userId = session.user.id;
  const { id_curso, nuevo_estado }: UpdateStatusRequest = req.body;

  if (!id_curso || !nuevo_estado) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    // Checamos que el usuario esta inscrito en el curso
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('curso_usuario')
      .select('*')
      .eq('id_usuario', userId)
      .eq('id_curso', id_curso)
      .single();

    if (checkError || !existingEnrollment) {
      return res.status(404).json({ error: 'No estás inscrito en este curso' });
    }

    // Se actualiza el estado del curso
    const { error: updateError } = await supabase
      .from('curso_usuario')
      .update({ 
        estado: nuevo_estado,
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('id_usuario', userId)
      .eq('id_curso', id_curso);

    if (updateError) throw updateError;

    return res.status(200).json({ 
      success: true, 
      message: `Estado actualizado a ${nuevo_estado}` 
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return res.status(500).json({ error: message });
  }
}