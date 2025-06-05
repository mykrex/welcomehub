import 'openai/shims/node';
import { OpenAI } from "openai";
import { supabase } from "@/lib/supabase.server";
import politicas from "../app/docs/politicas.json";
import Fuse from "fuse.js";

// Inicializa OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Interfaces para request y resultado
interface RequestBody {
  prompt: string;
  id_usuario: string;
}
interface Result {
  response?: string;
  error?: string;
}

// Normaliza cadenas: quita acentos, pasa a minúsculas y trim
function normalizeText(str: string) {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// Función principal de manejo de chat
export async function handleChatRequest(body: RequestBody): Promise<Result> {
  const { prompt: rawPrompt, id_usuario } = body;
  const prompt = normalizeText(rawPrompt);

  // Validación de ID de usuario
  if (!id_usuario) {
    return { error: "Falta el ID de usuario" };
  }

  // 1) Obtener información del usuario
  const { data: userInfo, error: userError } = await supabase
    .from("usuario")
    .select("nombres, rol, puesto, id_equipo")
    .eq("id_usuario", id_usuario)
    .single();
  if (userError || !userInfo) {
    return { error: "Error al obtener la información del usuario" };
  }
  const userName = userInfo.nombres;
  const userPosition = userInfo.puesto;
  const idEquipo = userInfo.id_equipo;
  const userRole = userInfo.rol;

  // Detectar intenciones especificas (cursos, lider, etc)
  // intencion: "mis cursos"
  if (["mis cursos", "cursos", "cursos asignados", "cursos inscritos"].some(kw => prompt.includes(normalizeText(kw)))){
    const { data: cursos, error: cursosError } = await supabase
      .from("curso_usuario")
      .select("curso(id_curso, titulo, descripcion, duracion, obligatorio), estado")
      .eq("id_usuario", id_usuario);
    
    if (cursosError) {
      return { response: "Ocurrió un error al obtener tus cursos." };
    }
    if (!cursos || cursos.length === 0) {
      return { response: "No tienes cursos asignados o no estas inscrito a ningun curso." };
    }
    // Arreglo con toda la info de los cursos 
    const coursesInfo = cursos.map((c: any) => ({
      id: c.curso.id_curso,
      titulo: c.curso.titulo,
      descripcion: c.curso.descripcion,
      duracion: c.curso.duracion,
      obligatorio: c.curso.obligatorio,
      estado: c.estado
    }));

    // Mostramos los cursos asignados
    const listaCursos = coursesInfo.map((course: any, i: number) => `${i + 1}. ${course.titulo}`).join("\n");
    return { response: `Tus cursos asignados son:\n\n${listaCursos}` };
  }

  // intencion: duracion curso especifico
  if (prompt.includes("duracion de curso")) {
    const match = rawPrompt.match(/duracion de curso (.+)/i);
    if (match && match[1]) {
      const cursoBuscado = match[1].trim();
      const { data: cursoData, error: cursoDataError } = await supabase
        .from("curso")
        .select("titulo, duracion")
        .ilike("titulo", `%${cursoBuscado}%`)
        .single();
      if (cursoDataError || !cursoData) {
        return { response: "No se encontró información sobre el curso solicitado." };
      }
      return { response: `La duración del curso "${cursoData.titulo}" es de ${cursoData.duracion} minutos.` };
    }
  }

  // intencion: descripcion de curso 
  if (prompt.includes("curso") || prompt.includes("descripcion curso") || prompt.includes("informacion curso")) {
    const match = rawPrompt.match(/curso (.+)/i);
    if (match && match[1]) {
      const cursoBuscado = match[1].trim();
      const { data: cursoData, error: cursoDataError } = await supabase
        .from("curso")
        .select("titulo, descripcion")
        .ilike("titulo", `%${cursoBuscado}%`)
        .single();
      if (cursoDataError || !cursoData) {
        return { response: "No se encontró información sobre el curso solicitado." };
      }
      return { response: `El curso "${cursoData.titulo}" es sobre ${cursoData.descripcion}` };
    }
  }

  // intencion: quien es mi lider
  if (["quien es mi lider", "quien es mi jefe", "quien es mi supervisor"].some(kw => prompt.includes(normalizeText(kw)))) {
    if (userRole === "administrador") {
      return { response: "Como administrador no tienes lider asignado o lider directo. Si necesitas asisencia yo te puedo apoyar, ¿Como te ayudo?" };
    } else {
      let liderName = "líder desconocido";
      if (idEquipo){
        const { data: eqData } = await supabase
          .from("equipo_trabajo")
          .select("nombre, id_administrador")
          .eq("id_equipo", idEquipo)
          .single();
        if(eqData?.id_administrador){
          const { data: liData } = await supabase
            .from("usuario")
            .select("nombres")
            .eq("id_usuario", eqData.id_administrador)
            .single();
          if (liData) liderName = liData.nombres;
        }
      }
      return { response: `Tu líder es ${liderName}. Si necesitas ayuda, no dudes en preguntar.` };
    }
  }

  // 3) Obtener información de equipo y líder
  let nombreEquipo = "equipo desconocido";
  let liderName = "líder desconocido";
  if (idEquipo) {
    const { data: eqData } = await supabase
      .from("equipo_trabajo")
      .select("nombre, id_administrador")
      .eq("id_equipo", idEquipo)
      .single();
    if (eqData) {
      nombreEquipo = eqData.nombre || nombreEquipo;
      if (eqData.id_administrador) {
        const { data: liData } = await supabase
          .from("usuario")
          .select("nombres")
          .eq("id_usuario", eqData.id_administrador)
          .single();
        if (liData) liderName = liData.nombres; // Note: variable name typo fix
      }
    }
  }

  // 3) RAG: búsqueda con Fuse.js sobre politicas.json
  const fuse = new Fuse(politicas, {
    keys: ["title", "description", "content"],
    threshold: 0.6,
    ignoreLocation: true,
    includeScore: true,
    minMatchCharLength: 3,
  });

  let searchResults = fuse.search(prompt);
  // Fallback por substring si Fuse no encuentra
  if (!searchResults.length) {
    searchResults = politicas
      .filter(p => {
        const hay = normalizeText(p.title + " " + p.description + " " + p.content);
        return prompt.split(" ").some(w => w.length > 3 && hay.includes(w));
      })
      .map((item, index) => ({ item, score: 0, refIndex: index }));
  }

  // Tomar secciones top
  const topSections = searchResults
    .sort((a, b) => a.score! - b.score!)
    .slice(0, 3)
    .map(r => {
      const { title, description, content } = r.item;
      return [
        `## ${title}`,
        description,
        content
      ].join("\n\n");
    });

  const knowledgeContext = topSections.length
    ? topSections.join("\n\n---\n\n")
    : "No se encontró información relevante en las políticas.";

  // 4) Cargar historial de mensajes (sin saludo)
  const { data: history } = await supabase
    .from("mensajes")
    .select("input_usuario, output_bot")
    .eq("id_usuario", id_usuario)
    .order("timestamp", { ascending: true })
    .limit(5);

  type Message = { role: "system" | "user" | "assistant"; content: string };
  const historial: Message[] = history
    ? history.flatMap(msg => [
        ...(msg.input_usuario ? [{ role: "user" as const, content: msg.input_usuario }] : []),
        ...(msg.output_bot ? [{ role: "assistant" as const, content: msg.output_bot }] : []),
      ])
    : [];

  // 5) Construir mensaje de sistema con contexto y metadata
  const systemMessage = `Eres Compi, asistente virtual para onboarding en Neoris.

  Usa únicamente esta información de políticas:
  ${knowledgeContext}

  Información del usuario:
  - Nombre: ${userName}
  - Puesto: ${userPosition}
  - Equipo: ${nombreEquipo}
  - Líder: ${liderName}

  Responde de forma amigable y profesional.`;

  const messages: Message[] = [
    { role: "system", content: systemMessage },
    ...historial,
    { role: "user", content: rawPrompt },
  ];

  // 6) Llamar a OpenAI
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });
    const answer = completion.choices[0].message.content;
    if (!answer) return { error: "No se obtuvo respuesta de Compi" };

    // 7) Guardar mensaje en BD
    await supabase.from("mensajes").insert([{ id_usuario, input_usuario: rawPrompt, output_bot: answer, timestamp: new Date().toISOString() }]);

    return { response: answer };
  } catch (error) {
    console.error("Error en OpenAI:", error);
    return { error: "Error al procesar la respuesta" };
  }
}
