import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });
  const { data, error } = await supabase.auth.refreshSession();

  if (error || !data.session) {
    return res.status(401).end();
  }
  
  return res.status(200).json({ session: data.session });
}