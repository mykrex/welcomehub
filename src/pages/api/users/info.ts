import { supabaseServer } from '@/lib/supabaseServer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');

  const token = req.cookies['sb-access-token']; // Cookie detected

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const { data: userData, error: authError } = await supabaseServer.auth.getUser(token);

  if (authError || !userData?.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const userId = userData.user.id;

  const { data, error } = await supabaseServer
    .from('usuario')
    .select('*')
    .eq('id_usuario', userId)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  return res.status(200).json(data);
}
