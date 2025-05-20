import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

type Data = { ok: true } | { error: string };

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data> ) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Iniciar el cliente Supabase con req y res
  const supabase = createPagesServerClient({ req, res });

  // Checamos la sesion
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  const userId = session.user.id;

  try {
    // Se borra la foto de perfil del bucket 'avatars'
    const filePath = `${userId}/profile.png`;
    const { error: removeError } = await supabase
      .storage
      .from('avatars')
      .remove([filePath]);

    if (removeError) {
      return res.status(500).json({ error: removeError.message });
    }

    // Respondemos ok cuando se borro
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Delete-avatar error:', err);
    const message = err instanceof Error ? err.message : 'Error inesperado';
    return res.status(500).json({ error: message });
  }
}