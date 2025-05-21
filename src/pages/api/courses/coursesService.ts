import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

// Servicio para obtener los cursos de un usuario
export const fetchUserCourses = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createPagesServerClient({ req, res });

  const { data: session, error: sessErr } = await supabase.auth.getSession();
  if (sessErr || !session) throw new Error('No autorizado');

  const { data: courses, error: coursesErr } = await supabase
    .from('courses')
    .select('*')
    .eq('user_id', session.user.id);

  if (coursesErr) throw new Error('Error obteniendo los cursos');

  return courses;
};
