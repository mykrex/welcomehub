import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

type Data = { url: string } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');

  const supabase = createPagesServerClient({ req, res });

  const { id_usuario } = req.query;

  // Si se pasa un id_usuario en query, usamos ese; si no, usamos el de sesión
  let userId = id_usuario as string;

  if (!userId) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    userId = session.user.id;
  }

  // Generar URL firmada
  const { data: signedData, error: storageError } = await supabase
    .storage
    .from('avatars')
    .createSignedUrl(`${userId}/profile.png`, 60);

  if (storageError || !signedData.signedUrl) {
    return res.status(404).json({ error: 'Avatar no encontrado' });
  }

  return res.status(200).json({ url: signedData.signedUrl });
}
