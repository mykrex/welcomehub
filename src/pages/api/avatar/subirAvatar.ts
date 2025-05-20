import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { IncomingForm, File as FormidableFile, Fields, Files } from 'formidable';
import fs from 'fs';

// Desactivamos el body parser para manejar multipart/form-data
export const config = { api: { bodyParser: false } };

type Data = { ok: true } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  // Iniciamos el cliente de Supabase ligado a req/res
  const supabase = createPagesServerClient({ req, res });

  // Checamos que exista una sesion
  const { data: { session }, error: sessionError} = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  const userId = session.user.id;

  try {
    // Ahora se hace parse a multipart/form-data
    const { fields, files } = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    // Checamos que el userId del cuerpo coincida con la sesion
    const rawUserId = fields.userId;
    const bodyUserId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
    if (!bodyUserId || bodyUserId !== userId) {
      return res.status(403).json({ error: 'Usuario no autorizado' });
    }

    // Obtenemos el archivo subido
    const fileField = files.file as FormidableFile | FormidableFile[];
    const file = Array.isArray(fileField) ? fileField[0] : fileField;
    if (!file?.filepath) {
      return res.status(400).json({ error: 'Falta file' });
    }

    // Leemos el buffer y tipo de contenido
    const fileBuffer = await fs.promises.readFile(file.filepath);
    const contentType = typeof file.mimetype === 'string' ? file.mimetype : undefined;

    // Se sube al bucket
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(`${userId}/profile.png`, fileBuffer, {
        upsert: true,
        contentType,
      });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Upload-avatar error:', err);
    const message = err instanceof Error ? err.message : 'Error inesperado';
    return res.status(500).json({ error: message });
  }
}