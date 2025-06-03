import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const supabase = createPagesServerClient({ req, res });
  const { data: { session }, error: sessErr } = await supabase.auth.getSession();
  if (sessErr || !session) return res.status(401).json({ error: 'No autorizado' });

  const userId = session.user.id;

  try {
    const idReto = '649dd562-8866-42d0-bc7d-9f245140f18e'; // ID del reto cambio de foto

    // Verificar si ya existe
    const { data: retoExistente } = await supabase
      .from('reto_usuario')
      .select('id_reto')
      .eq('id_usuario', userId)
      .eq('id_reto', idReto)
      .single();

    if (retoExistente) {
      return res.status(200).json({ message: 'Reto ya completado.' });
    }

    // Insertar nuevo registro del reto
    await supabase.from('reto_usuario').insert({
      id_usuario: userId,
      id_reto: idReto,
      completado: true,
      terminado: new Date()
    });

    return res.status(200).json({ message: 'Reto cambio foto completado.' });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error en verificarCambioFoto:', error);
    return res.status(500).json({ error: message });
  }
}
