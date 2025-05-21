import 'openai/shims/node';
import { OpenAI } from "openai";
import { supabase } from "@/lib/supabase.server";
import politicas from "../app/docs/politicas.json";
import Fuse from "fuse.js";
//import { time } from 'console';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RequestBody {
  prompt: string;
  id_usuario: string;
}

interface Result {
  response?: string;
  error?: string;
}

export async function handleChatRequest(body: RequestBody): Promise<Result> {
  const { prompt, id_usuario } = body;

  if(!id_usuario) return { error: "Falta el ID de usuario" };
  

  // obtener info del usuario
  const { data: userInfo, error: userError } = await supabase
    .from("usuario")
    .select("nombres, puesto, id_equipo")
    .eq("id_usuario", id_usuario)
    .single();

    if (userError || !userInfo) {
      return { error: "Error al obtener la información del usuario" };
    }

    const userName = userInfo.nombres;
    const userRole = userInfo.puesto;
    const idEquipo = userInfo.id_equipo;

    // obtener info del equipo
    let nombreEquipo = "equipo desonocido";
    if( idEquipo) {
      const { data: equipoInfo, error: equipoError } = await supabase
        .from("equipo_trabajo")
        .select("nombre, id_administrador")
        .eq("id_equipo", idEquipo)
        .single();
      if (!equipoError && equipoInfo) nombreEquipo = equipoInfo.nombre;
    }

    // obtener lider del equipo
    let liderName = "lider desconocido";
    const { data: liderInfo, error: liderError } = await supabase
      .from("usuario")
      .select("nombres")
      .eq("id_usuario", idEquipo)
      .single();
    if (!liderError && liderInfo) liderName = liderInfo.nombres;

    // buscar politicas con Fuse.js
    const fuse = new Fuse(politicas, {
      keys: ["title", "content"],
      threshold: 0.4,
      includeScore: true,
    });

    const searchResults = fuse.search(prompt);
    const topSections = searchResults
      .sort((a, b) => (a.score! - b.score!))
      .slice(0, 3)
      .map((result) => result.item.content);

    const knowledgeContext = topSections.join("\n\n");

    // obtener historial reciente 
    const {data: history, error: historyError} = await supabase
      .from("mensajes")
      .select("input_usuario, output_bot")
      .eq("id_usuario", id_usuario)
      .order("timestamp", { ascending: false })
      .limit(5);

    type Message = {
      role: "system" | "user" | "assistant";
      content: string;
    };

    let historial: Message[] = [];
    if (history && history.length > 0) {
      historial.push({
        role: "assistant",
        content: `Hola ${userName}, retomemeos donde nos quedamos.`,
      });
      historial = historial.concat(
        history 
          .slice()
          .reverse()
          .flatMap((msg) => [
            { role: "user", content: msg.input_usuario || "" },
            { role: "assistant", content: msg.output_bot || "" },
          ])
      );
    } else {
      historial.push({
        role: "assistant",
        content: `Hola ${userName}, soy tu asistente virtual. Estoy aquí para ayudarte con cualquier pregunta o inquietud que tengas sobre el onboarding de la empresa. ¿En qué puedo ayudarte hoy?`,
      });
    }

    // Construir mensaje para OpenAI incluyendo contexto RAG y metadata del ususario
    const systemMessageContent = `
    Eres Compi, asistente virtual para onboarding de empleados en la empresa Neoris.
    
    Usa unicamente la siguiente información para responder a las preguntas del usuario:
    ${knowledgeContext}
    
    Informacion del ususaio:
    - Nombre: ${userName}
    - Puesto: ${userRole}
    - Equipo: ${nombreEquipo}
    - Lider: ${liderName}
    - ID de usuario: ${id_usuario}
    
    Responde de manera amigable y profesional. Si no tienes la respuesta, di que no lo sabes. Pero puedes contactar a tu lider para obtener más información.
    `;

    const messages: Message[] = [
      { role: "system", content: systemMessageContent },
      ...historial,
      { role: "user", content: prompt },  
    ];

    // Enviar a OpenAI y obtener respuesta
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
      });

      const answer = completion.choices[0].message.content;

      if(!answer) return { error: "No se obtuvo respuesta de Compi" };

      // Guardar mensaje en la base de datos
      await supabase.from("mensajes").insert([
        {
          id_usuario,
          input_usuario: prompt,
          output_bot: answer,
          timestamp: new Date().toISOString(),
        },
      ]);
      return { response: answer };
    } catch (error) {
      console.error("Error en OpenAI:", error);
      return { error: "Error al procesar la respuesta" };
    }  
}