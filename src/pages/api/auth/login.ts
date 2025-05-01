import { supabase } from '@/lib/supabase'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' })
  }

  const { data, error } = await supabase.auth.signInWithPassword ({
    email,
    password,
  });

  if (error || !data.session || !data.user) {
    return res.status(401).json({ error: 'Credenciales incorrectas' })
  }

  const { user, session } = data;

  return res.status(200).json({ 
    access_token: session.access_token,
    user: { 
      id_usuario: user.id,
      email: user.email, 
      rol: user.user_metadata?.rol || 'empleado',
    },
  });
}