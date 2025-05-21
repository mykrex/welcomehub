import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

// Servicio para obtener los cursos de un usuario
export const fetchUserCourses = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createPagesServerClient({ req, res });

  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession();

  // Verifica si hay error o si la sesión es nula
  if (sessErr || !session?.user) throw new Error('No autorizado');

  // Obtén los cursos del usuario
  const { data: courses, error: coursesErr } = await supabase
    .from('courses')
    .select('*')
    .eq('user_id', session.user.id); // Ahora 'user' siempre estará definido porque verificamos antes

  if (coursesErr) throw new Error('Error obteniendo los cursos');

  return courses;
};
