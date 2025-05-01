import { supabase } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end("Method not allowed");

  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(400).json({ error: "Token no proporcionado" });
  }

  const { data: userData, error: authError } = await supabase.auth.getUser(token);

  console.log("userData:", userData);
  console.log("authError:", authError);

  if (authError || !userData?.user) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const userId = userData.user.id;

  const { data, error } = await supabase
    .from("usuario")
    .select(`
      id_usuario,
      nombres,
      apellidos,
      email,
      telefono,
      puesto,
      en_neoris_desde,
      fecha_nacimiento,
      contrasena
    `)
    .eq("id_usuario", userId)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  return res.status(200).json({ perfil: data });
}