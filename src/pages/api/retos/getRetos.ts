import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export type Reto = {
  id_reto: string;
  puntos: number;
  titulo_reto: string;
  descripcion_reto: string;
  tipo_reto: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');

  const supabase = createPagesServerClient({ req, res });
  const { data, error } = await supabase
    .from('reto')
    .select('id_reto, puntos, titulo_reto, descripcion_reto, tipo_reto');

  if (error) {
    console.error('Error al obtener retos:', error);
    return res.status(500).json({ error: error.message });
  }

  const retos: Reto[] = (data ?? []).map(r => ({
    id_reto: r.id_reto,
    puntos: Number(r.puntos),
    titulo_reto: r.titulo_reto,
    descripcion_reto: r.descripcion_reto,
    tipo_reto: r.tipo_reto
  }));

  return res.status(200).json(retos);
}
