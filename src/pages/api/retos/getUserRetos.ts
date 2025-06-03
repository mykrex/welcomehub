import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export type UserReto = {
  id_reto: string;
  terminado: string;
  completado: boolean;
  reto: {
    puntos: number;
    titulo_reto: string;
    descripcion_reto: string;
    tipo_reto: string;
    es_continuo: boolean;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');

  const supabase = createPagesServerClient({ req, res });
  const { data: { session }, error: sessErr } = await supabase.auth.getSession();

  if (sessErr || !session) return res.status(401).json({ error: 'No autorizado' });

  const userId = session.user.id;

  const { data, error } = await supabase
    .from('reto_usuario')
    .select(`
      id_reto,
      terminado,
      completado,
      reto (
        puntos,
        titulo_reto,
        descripcion_reto,
        tipo_reto,
        es_continuo
      )
    `)
    .eq('id_usuario', userId);

  if (error) {
    console.error('Error al obtener retos del usuario:', error);
    return res.status(500).json({ error: error.message });
  }

  // Ajustar formato para asegurar que 'reto' es objeto único
  const userRetos: UserReto[] = (data ?? []).map(r => ({
    id_reto: r.id_reto,
    terminado: r.terminado,
    completado: r.completado,
    reto: Array.isArray(r.reto) ? r.reto[0] : r.reto
  }));

  return res.status(200).json(userRetos);
}
