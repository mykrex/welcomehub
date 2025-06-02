import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

interface UpdateStatusRequest {
  id_curso: string;
  nuevo_estado: 'sin_comenzar' | 'en_progreso' | 'completado';
}

type Data = { success: boolean; message: string } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'PUT') return res.status(405).end('Method not allowed');

  const supabase = createPagesServerClient({ req, res });
  const { data: { session }, error: sessErr } = await supabase.auth.getSession();
  if (sessErr || !session) return res.status(401).json({ error: 'No autorizado' });

  const userId = session.user.id;
  const { id_curso, nuevo_estado }: UpdateStatusRequest = req.body;

  if (!id_curso || !nuevo_estado) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    // Verificar inscripción del usuario en el curso
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('curso_usuario')
      .select('*')
      .eq('id_usuario', userId)
      .eq('id_curso', id_curso)
      .single();

    if (checkError || !existingEnrollment) {
      return res.status(404).json({ error: 'No estás inscrito en este curso' });
    }

    // Actualizar estado del curso
    const { error: updateError } = await supabase
      .from('curso_usuario')
      .update({
        estado: nuevo_estado,
        last_updated: new Date().toISOString()
      })
      .eq('id_usuario', userId)
      .eq('id_curso', id_curso);

    if (updateError) throw updateError;

    // 🚀 Verificar retos si se completó el curso
    if (nuevo_estado === 'completado') {
      // Traer información del curso (obligatorio)
      const { data: curso, error: cursoError } = await supabase
        .from('curso')
        .select('obligatorio')
        .eq('id_curso', id_curso)
        .single();

      if (cursoError || !curso) throw cursoError ?? new Error('Curso no encontrado');

      if (curso.obligatorio) {
        // Obtener id_reto dinámico para 'curso_obligatorio_completo'
        const { data: retoObligatorio, error: errorRetoObligatorio } = await supabase
          .from('reto')
          .select('id_reto')
          .eq('descripcion_reto', 'curso_obligatorio_completo')
          .single();
        if (errorRetoObligatorio || !retoObligatorio) throw errorRetoObligatorio ?? new Error('Reto no encontrado');

        await supabase.from('reto_usuario').insert({
          id_usuario: userId,
          id_reto: retoObligatorio.id_reto,
          completado: true,
          terminado: new Date()
        });

        // Verificar todos los cursos obligatorios del usuario
        const { data: cursosUsuario, error: errorCursos } = await supabase
          .from('curso_usuario')
          .select('id_curso, estado')
          .eq('id_usuario', userId);

        if (errorCursos) throw errorCursos;

        const cursoIds = cursosUsuario.map(c => c.id_curso);
        if (cursoIds.length > 0) {
          const { data: cursosDetalles, error: errorDetalles } = await supabase
            .from('curso')
            .select('id_curso, obligatorio')
            .in('id_curso', cursoIds);

          if (errorDetalles) throw errorDetalles;

          const todosObligatoriosCompletados = cursosDetalles
            .filter(c => c.obligatorio)
            .every(cursoDet => {
              const cursoUsuario = cursosUsuario.find(cu => cu.id_curso === cursoDet.id_curso);
              return cursoUsuario?.estado === 'completado';
            });

          if (todosObligatoriosCompletados) {
            const { data: retoTodos, error: errorRetoTodos } = await supabase
              .from('reto')
              .select('id_reto')
              .eq('descripcion_reto', 'todos_cursos_obligatorios_completos')
              .single();
            if (errorRetoTodos || !retoTodos) throw errorRetoTodos ?? new Error('Reto no encontrado');

            await supabase.from('reto_usuario').insert({
              id_usuario: userId,
              id_reto: retoTodos.id_reto,
              completado: true,
              terminado: new Date()
            });
          }
        }

      } else {
        // Obtener id_reto dinámico para 'curso_opcional_completo'
        const { data: retoOpcional, error: errorRetoOpcional } = await supabase
          .from('reto')
          .select('id_reto')
          .eq('descripcion_reto', 'curso_opcional_completo')
          .single();
        if (errorRetoOpcional || !retoOpcional) throw errorRetoOpcional ?? new Error('Reto no encontrado');

        await supabase.from('reto_usuario').insert({
          id_usuario: userId,
          id_reto: retoOpcional.id_reto,
          completado: true,
          terminado: new Date()
        });
      }
    }

    return res.status(200).json({ success: true, message: `Estado actualizado a ${nuevo_estado}` });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Update status error:', error);
    return res.status(500).json({ error: message });
  }
}
