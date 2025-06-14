import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

type Miembro = {
  nombres: string;
  apellidos: string;
  email: string;
  puesto: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | { equipo: string; administrador: string; miembros: Miembro[] }
    | { error: string }
  >
) {
  if (req.method !== "GET") return res.status(405).end("Method not allowed");

  const supabase = createPagesServerClient({ req, res });

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return res.status(401).json({ error: "No autorizado" });
  }
  const userId = session.user.id;

  const { data: usuario, error: userError } = await supabase
    .from("usuario")
    .select("id_equipo")
    .eq("id_usuario", userId)
    .maybeSingle();

  if (userError || !usuario?.id_equipo) {
    return res
      .status(404)
      .json({ error: "Usuario no encontrado o sin equipo asignado" });
  }
  const id_equipo = usuario.id_equipo;

  const { data: equipo, error: equipoError } = await supabase
    .from("equipo_trabajo")
    .select("nombre, id_administrador")
    .eq("id_equipo", id_equipo)
    .maybeSingle();

  if (equipoError || !equipo) {
    return res.status(404).json({ error: "Equipo no encontrado" });
  }

  const { data: adminUsuario, error: adminError } = await supabase
    .from("usuario")
    .select("email")
    .eq("id_usuario", equipo.id_administrador)
    .maybeSingle();

  if (adminError || !adminUsuario?.email) {
    return res
      .status(404)
      .json({ error: "Correo del administrador no encontrado" });
  }

  const { data, error: miembrosError } = await supabase
    .from("usuario")
    .select("nombres, apellidos, email, puesto")
    .eq("id_equipo", id_equipo);

  if (miembrosError) {
    return res.status(500).json({ error: "Error al obtener miembros" });
  }

  const miembros = (data ?? []) as Miembro[];

  return res.status(200).json({
    equipo: equipo.nombre,
    administrador: adminUsuario.email,
    miembros,
  });
}
