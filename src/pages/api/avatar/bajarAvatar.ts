import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  // Validate that there is a session cookie
  const token = req.cookies['sb-access-token'];
  if (!token) return res.status(401).json({ error: 'No autorizado' });

  // Get user from JWT
  const { data: userData, error: authError } = await supabaseServer.auth.getUser(token);
  if (authError || !userData.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  const userId = userData.user.id;

  // Create signed URL for the avatar
  const { data, error } = await supabaseServer
    .storage
    .from('avatars')
    .createSignedUrl(`${userId}/profile.png`, 60);

  if (error || !data.signedUrl) {
    return res.status(404).json({ error: 'Avatar no encontrado' });
  }

  // Return the URL to client
  return res.status(200).json({ url: data.signedUrl });
}