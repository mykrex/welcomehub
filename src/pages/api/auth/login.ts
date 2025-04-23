import { supabase } from '@/lib/supabase'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' })
  }

  // Consulta tu tabla personalizada
  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: 'Usuario no encontrado' })
  }

  if (data.contrasena !== password) {
    return res.status(401).json({ error: 'Contraseña incorrecta' })
  }

  return res.status(200).json({ user: { email: data.email, rol: data.rol } })
}
