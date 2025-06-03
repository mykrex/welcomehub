import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const supabase = createPagesServerClient({ req, res });
  const { data: { session }, error: sessErr } = await supabase.auth.getSession();
  if (sessErr || !session) return res.status(401).json({ error: 'No autorizado' });

  const userId = session.user.id;
  const idReto = '20ac9d7c-e13e-4a15-8d2d-1765282777a5'; // ID del reto leer historia NEORIS

  try {
    const { data: retoExistente } = await supabase
      .from('reto_usuario')
      .select('id_reto')
      .eq('id_usuario', userId)
      .eq('id_reto', idReto)
      .single();

    if (retoExistente) {
      return res.status(200).json({ message: 'Reto ya completado.' });
    }

    await supabase.from('reto_usuario').insert({
      id_usuario: userId,
      id_reto: idReto,
      completado: true,
      terminado: new Date()
    });

    return res.status(200).json({ message: 'Reto leer historia NEORIS completado.' });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error en verificarLeeHistoria:', error);
    return res.status(500).json({ error: message });
  }
}
