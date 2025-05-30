import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export type Curso = {
  id_curso: string;
  titulo: string;
  descripcion: string;
  portada: string;
  duracion: number;
  obligatorio: boolean;
  estado: 'sin_comenzar' | 'en_progreso' | 'completado';
  ruta_archivo: string;
  last_updated?: string;
};

type RawRow = {
  estado: 'sin_comenzar' | 'en_progreso' | 'completado';
  last_updated?: string;
  curso: {
    id_curso: string;
    titulo: string;
    descripcion: string;
    portada: string;
    duracion: number;
    obligatorio: boolean;
    ruta_archivo: string;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');

  const supabase = createPagesServerClient({ req, res });

  const { data: { session }, error: sessErr } = await supabase.auth.getSession();
  
  if (sessErr || !session) return res.status(401).json({ error: 'No autorizado' });

  const userId = session.user.id;

  // Se hace la cosulta
  const { data: maybeRows, error } = await supabase
    .from('curso_usuario')
    .select(`
      estado,
      last_updated,
      curso (
        id_curso,
        titulo,
        descripcion,
        portada,
        duracion,
        obligatorio,
        ruta_archivo
      )
    `)
    .eq('id_usuario', userId);

  if (error) return res.status(500).json({ error: error.message });

  // Hacemos cast desde unknown
  const rows = (maybeRows ?? []) as unknown as RawRow[];

  // Se mapea el RawRow a Curso
  const cursos: Curso[] = rows.map(r => ({
    id_curso:    r.curso.id_curso,
    titulo:      r.curso.titulo,
    descripcion: r.curso.descripcion,
    portada:     r.curso.portada,
    duracion:    r.curso.duracion,
    obligatorio: r.curso.obligatorio,
    estado:      r.estado,
    ruta_archivo: r.curso.ruta_archivo,
    last_updated: r.last_updated,
  }));

  // Se devuelve el array de respuesta
  return res.status(200).json(cursos);
}