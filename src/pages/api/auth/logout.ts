import type { NextApiRequest, NextApiResponse } from "next";

import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

type Data = { message: string } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }

  const supabase = createPagesServerClient({ req, res });

  const { error } = await supabase.auth.signOut();

  if (error) {
    return res.status(500).json({ error: "Error cerrando sesión" });
  }

  return res.status(200).json({ message: "Sesión cerrada correctamente" });
}
