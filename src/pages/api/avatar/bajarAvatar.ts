import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

type Data = { url: string } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');

  // Iniciamos el ciente  de Supabase ligado a req/res
  const supabase = createPagesServerClient({ req, res });

  // Checamos la sesion con helper
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const userId = session.user.id;

  // Se genera la URL firmada para la foto de perfil
  const { data: signedData, error: storageError } = await supabase
    .storage
    .from('avatars')
    .createSignedUrl(`${userId}/profile.png`, 60);

  if (storageError || !signedData.signedUrl) {
    return res.status(404).json({ error: 'Avatar no encontrado' });
  }

  // Se devuelve la URL al cliente
  return res.status(200).json({ url: signedData.signedUrl });
}