import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

export const fetchUserProgress = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const supabase = createPagesServerClient({ req, res });

  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession();

  if (sessErr || !session?.user) throw new Error("No autorizado");

  const { data: progress, error: progressErr } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", session.user.id);

  if (progressErr) throw new Error("Error obteniendo el progreso");

  return progress;
};
