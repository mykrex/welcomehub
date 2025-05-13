import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { supabase } from "@/lib/supabase.server";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, id_usuario } = body;

    if (!prompt || !id_usuario) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    //debugging
    //console.log("ID de usuario recibido:", id_usuario);

    // const { data: allUsers } = await supabase
    //   .from("usuario")
    //   .select("id_usuario, nombres");

    // debugging
    //console.log("Todos los usuarios en la tabla:", allUsers);


    //  Obtener el nombre del usuario
    const { data: userInfo, error: userError } = await supabase
      .from("usuario")
      .select("nombres")
      .eq("id_usuario", id_usuario)
      .single();

    // debugging
    console.log("Resultado de búsqueda del usuario:", userInfo);

    if (userError) {
      console.error("Error al consultar el nombre del usuario:", userError.message || userError);
    }

    if (!userInfo) {
      console.warn("No se encontró ningún usuario con ese ID:", id_usuario);
    }

    const userName = userInfo?.nombres ?? "usuario";

    // Obtener el puesto del usuario
    const { data: userPosition, error: positionError } = await supabase
      .from("usuario")
      .select("puesto")
      .eq("id_usuario", id_usuario)
      .single();

    // debugging
    console.log("Resultado de búsqueda del puesto:", userPosition);

    if (positionError) {
      console.error("Error al consultar el puesto del usuario:", positionError.message || positionError);
    }
    if (!userPosition) {
      console.warn("No se encontró ningún puesto para el usuario con ID:", id_usuario);
    }

    //Obtener Equipo del usuario mediante el id_usuario
    const { data: userEquipoInfo, error: equipoIdError } = await supabase
  .from("usuario")
  .select("id_equipo")
  .eq("id_usuario", id_usuario)
  .single();

const idEquipo = userEquipoInfo?.id_equipo;
// debugging
if (equipoIdError) {
  console.error("Error al obtener el ID del equipo:", equipoIdError.message);
}

let nombreEquipo = "equipo desconocido";

if (idEquipo) {
  const { data: equipoInfo, error: equipoInfoError } = await supabase
    .from("equipo")
    .select("nombre")
    .eq("id_equipo", idEquipo)
    .single();
  // debugging
  if (equipoInfoError) {
    console.error("Error al obtener el nombre del equipo:", equipoInfoError.message);
  } else {
    nombreEquipo = equipoInfo?.nombre ?? nombreEquipo;
  }
}
    

    const userRole = userPosition?.puesto ?? "usuario";

    //  Traer historial reciente
    const { data: history, error: historyError } = await supabase
      .from("mensajes")
      .select("id_usuario, input_usuario, output_bot")
      .eq("id_usuario", id_usuario)
      .order("timestamp", { ascending: false })
      .limit(5);

    if (historyError) {
      console.error("Error al traer el historial de mensajes:", historyError.message);
    }

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `
                Eres un asistente virtual llamado Compi. Tu tarea es ayudar a nuevos empleados durante su proceso de onboarding.

                El nombre del usuario que te está hablando es ${userName}. 
                Si te preguntan algo como "¿cómo me llamo?", "¿quién soy?", o "¿sabes mi nombre?", debes responder: "Tu nombre es ${userName}".

                El puesto del usuario es ${userRole}.
                Si te preguntan algo como "¿cuál es mi puesto?", "¿qué puesto tengo?", o "¿sabes cuál es mi puesto?", debes responder: "Tu puesto es ${userRole}".
                Si te preguntan algo como "¿cuál es mi rol?", "¿qué rol tengo?", o "¿sabes cuál es mi rol?", debes responder: "Tu rol es ${userRole}".

                Siempre responde de forma amigable y clara.

                El usuario pertenece al equipo ${nombreEquipo}.
                Si te preguntan algo como "¿a qué equipo pertenezco?", "¿cuál es mi equipo?", o "¿sabes a qué equipo pertenezco?", debes responder: "Tu equipo es ${nombreEquipo}".
                `,
      },
      ...(history?.reverse().flatMap((item) => [
        { role: "user" as const, content: item.input_usuario },
        { role: "assistant" as const, content: item.output_bot },
      ]) ?? []),
      { role: "user" as const, content: prompt },
    ];

    // Solicitud a OpenAI
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const answer = chatResponse.choices[0].message.content;

    // Guardar la conversación
    const { error: dbError } = await supabase.from("mensajes").insert([
      {
        id_usuario,
        nombre_usuario: userName,
        input_usuario: prompt,
        output_bot: answer,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (dbError) {
      console.error("Error al guardar el mensaje en la base de datos:", dbError.message);
    }

    return NextResponse.json({ response: answer });
  } catch (error: unknown) {
    console.error("Error con la API de OpenAI:", error);
    return NextResponse.json(
      { error: "Hubo un error al procesar tu solicitud." },
      { status: 500 }
    );
  }
}
