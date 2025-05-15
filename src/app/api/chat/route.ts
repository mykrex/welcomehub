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


    //  Obtener datos de la tabla "usuario" mediante el id_usuario
    const { data: userInfo, error: userError } = await supabase
      .from("usuario")
      .select("nombres, puesto, id_equipo")
      .eq("id_usuario", id_usuario)
      .single();


    if (userError) {
      console.error("Error al consultar la info del usuario:", userError.message || userError);
    }

    if (!userInfo) {
      console.warn("No se encontró ningún usuario con ese ID:", id_usuario);
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

      if (equipoInfoError) {
        console.error("Error al obtener el nombre del equipo:", equipoInfoError.message);
      } else {
        nombreEquipo = equipoInfo?.nombre ?? nombreEquipo;
      }
    }

    // debugging
    console.log("Resultado de búsqueda del usuario:", userInfo);    
    console.log("Nombre del equipo:", nombreEquipo);

    // 1. Obtener IDs de cursos que el usuario ya tiene inscritos
const { data: cursosInscritos, error: inscritosError } = await supabase
  .from("curso_usuario")
  .select("id_curso")
  .eq("id_usuario", id_usuario)
  .neq("estado", "cancelado"); // opcional, si tienes cursos cancelados

if (inscritosError) {
  console.error("Error al obtener cursos inscritos:", inscritosError.message);
}

const idsCursosInscritos = cursosInscritos?.map((curso) => curso.id_curso) ?? [];

// 2. Obtener cursos recomendables basados en el puesto
const { data: cursosRecomendados, error: recomendadosError } = await supabase
  .from("curso")
  .select("id_curso, nombre, descripcion")
  .ilike("puesto_objetivo", `%${userRole}%`) // campo que asocie cursos con roles
  .not("id_curso", "in", `(${idsCursosInscritos.join(",")})`);

if (recomendadosError) {
  console.error("Error al obtener cursos recomendados:", recomendadosError.message);
}

const listaCursos = cursosRecomendados?.map(curso => `• ${curso.nombre}: ${curso.descripcion}`) ?? [];


const cursosTexto = listaCursos.length > 0 
  ? `Con base en su puesto (${userRole}), estos son cursos recomendados que aún no ha tomado:\n${listaCursos.join("\n")}`
  : `No hay cursos disponibles para recomendar en este momento que no haya tomado.`;





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

      // Agregar saludo al historial
      historial.push({
        role: "assistant",
        content: saludo,
      });

      // Guardar saludo en la base de datos
      await supabase.from("mensajes").insert([
        {
          id_usuario,
          nombre_usuario: userName,
          input_usuario: null,
          output_bot: saludo,
          timestamp: new Date().toISOString(),
        },
      ]);
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

                El usuario pertenece al equipo ${nombreEquipo}.
                Si te preguntan algo como "¿a qué equipo pertenezco?", "¿cuál es mi equipo?", o "¿sabes a qué equipo pertenezco?", debes responder: "Tu equipo es ${nombreEquipo}".

                ${cursosTexto}

                Si te pregunta por cursos, solo recomiéndale aquellos mencionados arriba.

                Siempre responde de forma amigable y clara.
                `,
      },
      ...historial,
      { role: "user", content: prompt },
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