import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '@/lib/supabaseServer';
import { IncomingForm, type File as FormidableFile, type Fields, type Files } from 'formidable';
import fs from 'fs';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    // parsear multipart
    const { fields, files } = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    // extract userId
    const rawUserId = fields.userId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
    if (!userId) {
      return res.status(400).json({ error: 'Falta userId' });
    }

    // extract file
    const fileField = files.file as FormidableFile | FormidableFile[];
    const file = Array.isArray(fileField) ? fileField[0] : fileField;
    if (!file?.filepath) {
      return res.status(400).json({ error: 'Falta file' });
    }

    // Replace stream for Buffer
    const fileBuffer = await fs.promises.readFile(file.filepath);
    const contentType = typeof file.mimetype === 'string' ? file.mimetype : undefined;

    const { error } = await supabaseServer
      .storage
      .from('avatars')
      .upload(`${userId}/profile.png`, fileBuffer, {
        upsert: true,
        contentType,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Upload-avatar error:', error);
    const message = error instanceof Error ? error.message : 'Error inesperado';
    return res.status(500).json({ error: message });
  }
}