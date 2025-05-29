import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

// Servicio para obtener el progreso del usuario
export const fetchUserProgress = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createPagesServerClient({ req, res });

  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession();

  // Verifica si hay error o si la sesión es nula
  if (sessErr || !session?.user) throw new Error('No autorizado');

  // Obtén el progreso del usuario
  const { data: progress, error: progressErr } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', session.user.id); // Ahora 'user' siempre estará definido porque verificamos antes

  if (progressErr) throw new Error('Error obteniendo el progreso');

  return progress;
};
