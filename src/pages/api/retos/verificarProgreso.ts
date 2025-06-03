import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

type Data = {
  message: string;
  retosInsertados?: number;
  detalles?: string[];
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');

  const supabase = createPagesServerClient({ req, res });
  const { data: { session }, error: sessErr } = await supabase.auth.getSession();
  if (sessErr || !session) return res.status(401).json({ message: 'No autorizado', error: 'No sesión activa' });

  const userId = session.user.id;
  let retosInsertados = 0;
  const detalles: string[] = [];

  try {
    const { data: cursosUsuario, error: errorCursos } = await supabase
      .from('curso_usuario')
      .select('id_curso, estado')
      .eq('id_usuario', userId);

    if (errorCursos) throw errorCursos;

    if (!cursosUsuario || cursosUsuario.length === 0) {
      return res.status(200).json({ message: 'El usuario no tiene cursos inscritos.' });
    }

    const cursoIds = cursosUsuario.map(c => c.id_curso);
    const { data: cursosDetalles, error: errorDetalles } = await supabase
      .from('curso')
      .select('id_curso, obligatorio')
      .in('id_curso', cursoIds);

    if (errorDetalles) throw errorDetalles;

    const { data: retos, error: errorRetos } = await supabase
      .from('reto')
      .select('id_reto, descripcion_reto');

    if (errorRetos) throw errorRetos;

    const getRetoId = (descripcion: string) =>
      retos?.find(r => r.descripcion_reto === descripcion)?.id_reto;

    const idRetoObligatorio = getRetoId('curso_obligatorio_completo');
    const idRetoOpcional = getRetoId('curso_opcional_completo');
    const idRetoTodos = getRetoId('todos_cursos_obligatorios_completos');

    // Obtener retos ya registrados por este usuario
    const { data: userRetos, error: errorUserRetos } = await supabase
      .from('reto_usuario')
      .select('id_reto')
      .eq('id_usuario', userId);

    if (errorUserRetos) throw errorUserRetos;

    const userRetosIds = userRetos?.map(r => r.id_reto) || [];

    for (const c of cursosUsuario) {
      const cursoDetalle = cursosDetalles?.find(cd => cd.id_curso === c.id_curso);
      if (!cursoDetalle) continue;

      if (c.estado === 'completado') {
        if (cursoDetalle.obligatorio && idRetoObligatorio && !userRetosIds.includes(idRetoObligatorio)) {
          await supabase.from('reto_usuario').insert({
            id_usuario: userId,
            id_reto: idRetoObligatorio,
            completado: true,
            terminado: new Date()
          });
          retosInsertados++;
          detalles.push(`Registrado curso_obligatorio_completo para curso ${c.id_curso}`);
        }
        if (!cursoDetalle.obligatorio && idRetoOpcional && !userRetosIds.includes(idRetoOpcional)) {
          await supabase.from('reto_usuario').insert({
            id_usuario: userId,
            id_reto: idRetoOpcional,
            completado: true,
            terminado: new Date()
          });
          retosInsertados++;
          detalles.push(`Registrado curso_opcional_completo para curso ${c.id_curso}`);
        }
      }
    }

    const todosObligatoriosCompletados = cursosDetalles
      .filter(cd => cd.obligatorio)
      .every(cursoDet => {
        const cursoUsuario = cursosUsuario.find(cu => cu.id_curso === cursoDet.id_curso);
        return cursoUsuario?.estado === 'completado';
      });

    if (todosObligatoriosCompletados && idRetoTodos && !userRetosIds.includes(idRetoTodos)) {
      await supabase.from('reto_usuario').insert({
        id_usuario: userId,
        id_reto: idRetoTodos,
        completado: true,
        terminado: new Date()
      });
      retosInsertados++;
      detalles.push(`Registrado todos_cursos_obligatorios_completos`);
    }

    return res.status(200).json({ message: 'Verificación completada', retosInsertados, detalles });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al verificar progreso:', error);
    return res.status(500).json({ message: 'Error', error: message });
  }
}
