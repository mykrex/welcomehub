import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export type Curso = {
  id_curso: string;
  titulo: string;
  descripcion: string;
  portada: string;
  duracion: number;
  obligatorio: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');

  const supabase = createPagesServerClient({ req, res });
  
  const { data: { session }, error: sessErr } = await supabase.auth.getSession();
  
  if (sessErr || !session) return res.status(401).json({ error: 'No autorizado' });

  const userId = session.user.id;

  try {
    // Se sacan los IDs de los cursos que ya tiene inscritos
    const { data: cursosInscritos, error: errorInscritos } = await supabase
      .from('curso_usuario')
      .select('id_curso')
      .eq('id_usuario', userId);

    if (errorInscritos) throw errorInscritos;

    const idsInscritos = cursosInscritos?.map(cu => cu.id_curso) || [];

    /** Por ahora es simple la recomendacion
     * se sacan los cursos no inscritos y se ordenan por duracion (los mas cortos van primero)
     * y se limita a 6
    */
    const { data: cursosRecomendados, error: errorRecomendados } = await supabase
      .from('curso')
      .select(`
        id_curso,
        titulo,
        descripcion,
        portada,
        duracion,
        obligatorio
      `)
      .not('id_curso', 'in', `(${idsInscritos.map(id => `"${id}"`).join(',') || '""'})`)
      .order('duracion', { ascending: true })
      .limit(6);

    if (errorRecomendados) throw errorRecomendados;

    return res.status(200).json(cursosRecomendados || []);
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return res.status(500).json({ error: message });
  }
}