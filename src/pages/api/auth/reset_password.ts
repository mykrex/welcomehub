import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, newPassword } = req.body as {
    email?: string;
    newPassword?: string;
  };
  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ error: "Email y nueva contraseña requeridos" });
  }

  const { data: userRow, error: findErr } = await supabaseServer
    .from("usuario")
    .select("id_usuario")
    .eq("email", email)
    .single();

  if (findErr || !userRow) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const { error: updErr } = await supabaseServer.auth.admin.updateUserById(
    userRow.id_usuario,
    { password: newPassword }
  );

  if (updErr) {
    console.error("admin.updateUserById error", updErr);
    return res.status(500).json({ error: "No se pudo cambiar contraseña" });
  }

  return res.status(200).json({ ok: true });
}
