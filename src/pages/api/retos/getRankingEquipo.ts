import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end("Method not allowed");

  const supabase = createPagesServerClient({ req, res });

  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession();
  if (sessErr || !session)
    return res.status(401).json({ error: "No autorizado" });

  const userId = session.user.id;

  try {
    const { data: user, error: userError } = await supabase
      .from("usuario")
      .select("id_equipo")
      .eq("id_usuario", userId)
      .single();

    if (userError || !user?.id_equipo) {
      return res
        .status(400)
        .json({ error: "No se encontró el equipo del usuario." });
    }

    const id_equipo = user.id_equipo;

    const { data: equipo, error: errorEquipo } = await supabase
      .from("equipo_trabajo")
      .select("nombre")
      .eq("id_equipo", id_equipo)
      .single();

    if (errorEquipo) throw errorEquipo;

    const nombre_equipo = equipo?.nombre ?? "Equipo";

    const { data: usuarios, error: errorUsuarios } = await supabase
      .from("usuario")
      .select("id_usuario, nombres, apellidos")
      .eq("id_equipo", id_equipo);

    if (errorUsuarios) throw errorUsuarios;

    const usuarioIds = usuarios.map((u) => u.id_usuario);

    const { data: retosUsuario, error: errorRetosUsuario } = await supabase
      .from("reto_usuario")
      .select("id_usuario, id_reto")
      .eq("completado", true)
      .in("id_usuario", usuarioIds);

    if (errorRetosUsuario) throw errorRetosUsuario;

    const { data: retos, error: errorRetos } = await supabase
      .from("reto")
      .select("id_reto, puntos");

    if (errorRetos) throw errorRetos;

    const puntosPorReto: Record<string, number> = {};
    retos.forEach((r) => {
      puntosPorReto[r.id_reto] = r.puntos ?? 0;
    });

    const puntosPorUsuario: Record<string, number> = {};
    usuarioIds.forEach((id) => {
      puntosPorUsuario[id] = 0;
    });

    retosUsuario.forEach((r) => {
      puntosPorUsuario[r.id_usuario] += puntosPorReto[r.id_reto] ?? 0;
    });

    const rankingBase = usuarios.map((u) => ({
      id: u.id_usuario,
      nombre_completo: `${u.nombres ?? ""} ${u.apellidos ?? ""}`.trim(),
      puntos_total: puntosPorUsuario[u.id_usuario] ?? 0,
    }));

    const ranking = await Promise.all(
      rankingBase.map(async (user) => {
        try {
          const { data: photoData } = await supabaseServer.storage
            .from("avatars")
            .createSignedUrl(`${user.id}/profile.png`, 600);
          return {
            ...user,
            imagen: photoData?.signedUrl || "/placeholder_profile.png",
          };
        } catch {
          return { ...user, imagen: "/placeholder_profile.png" };
        }
      })
    );

    ranking.sort((a, b) => b.puntos_total - a.puntos_total);

    return res.status(200).json({ equipo: nombre_equipo, ranking });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : String(error);
    console.error("Error en getRankingEquipo:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
