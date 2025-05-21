//import { supabaseServer } from '@/lib/supabaseServer';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
//import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const supabase = createPagesServerClient({ req, res });
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  //const { data, error } = await supabaseServer.auth.signInWithPassword({ email, password });

  if (error || !data.session || !data.user) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const userId = data.user.id;

  // Sync with usario table
  const { data: existe, error: queryError } = await supabase
    .from("usuario")
    .select("id_usuario")
    .eq("id_usuario", userId)
    .maybeSingle();

  if (!existe && !queryError) {
    const { error: insertError } = await supabase.from("usuario").insert({
      id_usuario: userId,
      email: data.user.email,
      nombres: data.user.user_metadata?.nombres || '',
      apellidos: data.user.user_metadata?.apellidos || '',
      telefono: '',
      puesto: '',
      en_neoris_desde: '',
      fecha_nacimiento: ''
    });

    if (insertError) {
      return res.status(500).json({ error: 'Error al insertar usuario' });
    }
  }

  const metadata = data.user.user_metadata as { rol?: string };
  const rol = metadata.rol ?? 'empleado';

  return res.status(200).json({
    user: {
      id_usuario: userId,
      email: data.user.email!,
      rol,
    },
  });
}