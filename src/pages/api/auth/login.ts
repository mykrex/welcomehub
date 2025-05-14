import { supabaseServer } from '@/lib/supabaseServer';
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  const { data, error } = await supabaseServer.auth.signInWithPassword({ email, password });

  if (error || !data.session || !data.user) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const { user, session } = data;
  const userId = user.id;

  // Save token with cookies
  res.setHeader('Set-Cookie', [
    serialize('sb-access-token', session.access_token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60,
    }),
    serialize('sb-refresh-token', session.refresh_token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    }),
  ]);

  // Sync with usario table
  const { data: existe, error: queryError } = await supabaseServer
    .from("usuario")
    .select("id_usuario")
    .eq("id_usuario", userId)
    .maybeSingle();

  if (!existe && !queryError) {
    const { error: insertError } = await supabaseServer.from("usuario").insert({
      id_usuario: userId,
      email: user.email,
      nombres: user.user_metadata?.nombres || '',
      apellidos: user.user_metadata?.apellidos || '',
      telefono: '',
      puesto: '',
      en_neoris_desde: '',
      fecha_nacimiento: ''
    });

    if (insertError) {
      return res.status(500).json({ error: 'Error al insertar usuario' });
    }
  }

  const rol = user.user_metadata?.rol || 'empleado';

  return res.status(200).json({
    user: {
      id_usuario: user.id,
      email: user.email,
      rol,
    },
    access_token: session.access_token,
    refresh_token: session.refresh_token
  });
}