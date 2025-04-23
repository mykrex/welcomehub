import { supabase } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end("Method not allowed");

  const email = req.query.email as string;

  if (!email) {
    return res.status(400).json({ error: "Email es requerido" });
  }

  const { data, error } = await supabase
    .from("usuario")
    .select(
      `
      nombres,
      apellidos,
      email,
      telefono,
      puesto,
      en_neoris_desde,
      fecha_nacimiento,
      contrasena
    `
    )
    .eq("email", email)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  return res.status(200).json({ perfil: data });
}
