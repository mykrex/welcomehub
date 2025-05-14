import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Read the token from the cookie
    const token = req.cookies['sb-access-token'];
    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    // Get user from JWT
    const { data: userData, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !userData.user) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    const userId = userData.user.id;

    // Delete avatar from 'avatar' bucket
    const filePath = `${userId}/profile.png`;
    const { error: removeError } = await supabaseServer
      .storage
      .from('avatars')
      .remove([filePath]);

    if (removeError) {
      return res.status(500).json({ error: removeError.message });
    }

    // Print result
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Delete-avatar error:', error);
    const message = error instanceof Error ? error.message : 'Error inesperado';
    return res.status(500).json({ error: message });
  }
}