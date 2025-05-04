import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

export function supabaseApiServer(req: NextApiRequest, res: NextApiResponse) {
  return createPagesServerClient({ req, res });
}
