import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end("Method not allowed");

  const supabase = createPagesServerClient({ req, res });

  const { data: { session }, error: sessErr } = await supabase.auth.getSession();
  
  if (sessErr || !session) return res.status(401).json({ error: 'No autorizado' });

  const { data: perfil, error: perfilErr } = await supabase
    .from('usuario')
    .select('*')
    .eq('id_usuario', session.user.id)
    .single();
  if (perfilErr || !perfil) return res.status(404).json({ error: 'Usuario no encontrado' });

  return res.status(200).json(perfil);
}