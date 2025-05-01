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
  const userId = user.id;

  //  Verifica si ya existe en tu tabla personalizada
  const { data: existe } = await supabase
    .from("usuario")
    .select("id_usuario")
    .eq("id_usuario", userId)
    .single();

  if (!existe) {
    //  Inserta con datos básicos (ajusta los campos según tu diseño)
    await supabase.from("usuario").insert({
      id_usuario: userId,
      nombres: user.user_metadata?.nombres || '',
      apellidos: user.user_metadata?.apellidos || '',
      email: user.email,
      telefono: '',
      puesto: '',
      en_neoris_desde: '',
      fecha_nacimiento: '',
      contrasena: '', // solo si la estás guardando tú, no recomendado
    });
  }

  const rol = user.user_metadata?.rol || 'empleado';
  
  return res.status(200).json({ 
    access_token: session.access_token,
    user: { 
      id_usuario: user.id,
      email: user.email, 
      rol,
    },
  });
}