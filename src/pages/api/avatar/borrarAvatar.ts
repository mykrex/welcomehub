import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

type Data = { ok: true } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const supabase = createPagesServerClient({ req, res });

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const userId = session.user.id;

  try {
    const filePath = `${userId}/profile.png`;
    const { error: removeError } = await supabase.storage
      .from("avatars")
      .remove([filePath]);

    if (removeError) {
      return res.status(500).json({ error: removeError.message });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Delete-avatar error:", err);
    const message = err instanceof Error ? err.message : "Error inesperado";
    return res.status(500).json({ error: message });
  }
}
