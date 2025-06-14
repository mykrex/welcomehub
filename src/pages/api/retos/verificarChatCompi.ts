import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const supabase = createPagesServerClient({ req, res });
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession();
  if (sessErr || !session)
    return res.status(401).json({ error: "No autorizado" });

  const userId = session.user.id;
  const idReto = "e01f8e1d-cdd0-413d-bbc5-eb27aa81d074";

  try {
    const { data: mensajes, error: errorMensajes } = await supabase
      .from("mensajes")
      .select("id")
      .eq("id_usuario", userId);

    if (errorMensajes) throw errorMensajes;

    const totalMensajes = mensajes?.length ?? 0;

    const { data: retos, error: errorRetos } = await supabase
      .from("reto_usuario")
      .select("id_reto_usuario")
      .eq("id_usuario", userId)
      .eq("id_reto", idReto);

    if (errorRetos) throw errorRetos;

    const totalRetos = retos?.length ?? 0;

    const faltan = totalMensajes - totalRetos;

    if (faltan > 0) {
      const inserts = Array.from({ length: faltan }, () => ({
        id_usuario: userId,
        id_reto: idReto,
        completado: true,
        terminado: new Date(),
      }));
      await supabase.from("reto_usuario").insert(inserts);
    }

    return res.status(200).json({
      message: `Reto actualizado: ${faltan} registros insertados.`,
      totalMensajes,
      totalRetos,
      faltan,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    console.error("Error en verificarChatCompi:", error);
    return res.status(500).json({ error: message });
  }
}
