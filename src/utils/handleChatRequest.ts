import 'openai/shims/node';
import { OpenAI } from "openai";
import { supabase } from "@/lib/supabase.server";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handleChatRequest({ prompt, id_usuario }: { prompt: string; id_usuario: number }) {
  if (!id_usuario) {
    return { error: "Falta el ID de usuario" };
  }

  const { data: userInfo, error: userError } = await supabase
    .from("usuario")
    .select("nombres, puesto, id_equipo")
    .eq("id_usuario", id_usuario)
    .single();

  if (userError) {
    console.error("Error al consultar la info del usuario:", userError.message || userError);
  }

  const userName = userInfo?.nombres ?? "usuario";
  const userRole = userInfo?.puesto ?? "usuario";
  const idEquipo = userInfo?.id_equipo;
  let nombreEquipo = "equipo desconocido";

  if (idEquipo) {
    const { data: equipoInfo, error: equipoInfoError } = await supabase
      .from("equipo_trabajo")
      .select("nombre")
      .eq("id_equipo", idEquipo)
      .single();

    if (!equipoInfoError && equipoInfo?.nombre) {
      nombreEquipo = equipoInfo.nombre;
    }
  }

//   const { data: cursosInscritos, error: inscritosError } = await supabase
//     .from("curso_usuario")
//     .select("id_curso")
//     .eq("id_usuario", id_usuario)
//     .neq("estado", "cancelado");

//   const idsCursosInscritos = cursosInscritos?.map((c) => c.id_curso) ?? [];

//   const { data: cursosRecomendados, error: recomendadosError } = await supabase
//     .from("curso")
//     .select("id_curso, nombre, descripcion")
//     .ilike("puesto_objetivo", `%${userRole}%`)
//     .not("id_curso", "in", `(${idsCursosInscritos.join(",")})`);

//   const listaCursos = cursosRecomendados?.map(c => `• ${c.nombre}: ${c.descripcion}`) ?? [];

//   const cursosTexto = listaCursos.length > 0
//     ? `Con base en su puesto (${userRole}), estos son cursos recomendados que aún no ha tomado:\n${listaCursos.join("\n")}`
//     : `No hay cursos disponibles para recomendar en este momento que no haya tomado.`;

  const { data: history } = await supabase
    .from("mensajes")
    .select("id_usuario, input_usuario, output_bot")
    .eq("id_usuario", id_usuario)
    .order("timestamp", { ascending: false })
    .limit(5);

  let historial: ChatCompletionMessageParam[] = [];

  if (history && history.length > 0) {
    historial.push({
      role: "assistant",
      content: `Hola ${userName}, retomemos donde nos quedamos.`,
    });

    historial = historial.concat(
      history.reverse().flatMap((item) => [
        { role: "user", content: item.input_usuario },
        { role: "assistant", content: item.output_bot },
      ])
    );
  } else {
    const saludo = `Hola ${userName}, ¿en qué puedo ayudarte hoy?`;
    historial.push({ role: "assistant", content: saludo });

    await supabase.from("mensajes").insert([
      {
        id_usuario,
        nombre_usuario: userName,
        input_usuario: null,
        output_bot: saludo,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (!prompt.trim()) {
      return { response: saludo };
    }
  }

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `
        Eres un asistente virtual llamado Compi. Tu tarea es ayudar a nuevos empleados durante su proceso de onboarding.

        El nombre del usuario es ${userName}. Si te preguntan algo como "¿cómo me llamo?" debes responder: "Tu nombre es ${userName}".
        El puesto del usuario es ${userRole}. Si te preguntan debes decir: "Tu puesto es ${userRole}".
        El equipo del usuario es ${nombreEquipo}.

        Siempre responde de forma amigable y clara.
      `,
    },
    ...historial,
    { role: "user", content: prompt },
  ];

  const chatResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  const answer = chatResponse.choices[0].message.content;

  await supabase.from("mensajes").insert([
    {
      id_usuario,
      nombre_usuario: userName,
      input_usuario: prompt,
      output_bot: answer,
      timestamp: new Date().toISOString(),
    },
  ]);

  return { response: answer };
}
