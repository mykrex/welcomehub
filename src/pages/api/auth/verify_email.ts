import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ error: "Email requerido" });

  const supabase = createPagesServerClient({ req, res });

  const { data, error } = await supabase
    .from("usuario")
    .select("id_usuario")
    .eq("email", email)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Email no registrado" });
  }

  return res.status(200).json({ ok: true });
}
