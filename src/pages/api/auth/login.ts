import { supabase } from '@/lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session || !data.user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  /**const isProduction = process.env.NODE_ENV === 'production';*/
  const { session, user } = data;

  res.setHeader('Set-Cookie', [
    serialize('sb-access-token', session.access_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      /**secure: isProduction,*/
    }),
    serialize('sb-refresh-token', session.refresh_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      /**secure: isProduction, */
    }),
  ]);

  return res.status(200).json({ user, session });
}