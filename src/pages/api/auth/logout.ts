import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end('Method not allowed');
    const deleteCookie = (name: string) =>
      serialize(name, '', {
        path: '/',
        httpOnly: true,
        maxAge: -1, // Delete cookies
      });

    res.setHeader('Set-Cookie', [
      deleteCookie('sb-access-token'),
      deleteCookie('sb-refresh-token'),
    ]);

    res.status(200).json({ message: 'Sesión cerrada correctamente' });
}