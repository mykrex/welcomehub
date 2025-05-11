import { supabase } from '@/lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');

  const token = req.cookies['sb-access-token']; // así sí detecta la cookie

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const { data: userData, error: authError } = await supabase.auth.getUser(token);

  if (authError || !userData?.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const userId = userData.user.id;

  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('id_usuario', userId)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  return res.status(200).json(data);
}

/*import { createServerClient } from '@supabase/ssr';
import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');

  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => cookies[key],
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log('⚠️ authError:', authError);
    return res.status(401).json({ error: 'No autorizado' });
  }

  const { data, error } = await supabase
    .from('usuario')
    .select(`*`)
    .eq('id_usuario', user.id)
    .single();

  if (error || !data) {
    console.log('⚠️ error usuario:', error);
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  return res.status(200).json(data);
}*/