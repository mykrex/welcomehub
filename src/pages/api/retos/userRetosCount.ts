import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

interface UserRetoCount {
  id_reto: string;
  veces_completado: number;
  puntos: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ counts: UserRetoCount[] } | { error: string }>
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
    const { data: retosUsuario, error: errorRetosUsuario } = await supabase
      .from("reto_usuario")
      .select("id_reto")
      .eq("completado", true)
      .eq("id_usuario", userId);

    if (errorRetosUsuario) throw errorRetosUsuario;

    const conteo: Record<string, number> = {};
    retosUsuario?.forEach((r) => {
      conteo[r.id_reto] = (conteo[r.id_reto] || 0) + 1;
    });

    const { data: retos, error: errorRetos } = await supabase
      .from("reto")
      .select("id_reto, puntos");

    if (errorRetos) throw errorRetos;

    const puntosPorReto =
      retos?.reduce((acc, r) => {
        acc[r.id_reto] = r.puntos ?? 0;
        return acc;
      }, {} as Record<string, number>) ?? {};

    const counts: UserRetoCount[] = Object.keys(puntosPorReto).map(
      (id_reto) => ({
        id_reto,
        veces_completado: conteo[id_reto] ?? 0,
        puntos: puntosPorReto[id_reto],
      })
    );

    return res.status(200).json({ counts });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    console.error("Error en userRetosCount:", error);
    return res.status(500).json({ error: message });
  }
}
