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
  actions?: Action[];
  error?: string;
}
// interfaz para action (botones)
type Action = {
  label: string;
  href: string;
};
// interfaces para los cursos
type Assignedcourse = {
  curso: {
    id_curso: string;
    titulo: string;
    descripcion: string;
    duracion: number;
    obligatorio: boolean;
  };
  estado: string;
};
type courseState = {
  curso: {
    titulo: string;
  };
  estado: string;
}

// Normaliza cadenas: quita acentos, pasa a minúsculas y trim
function normalizeText(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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

  // Obtener información del usuario
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
  const idTeam = userInfo.id_equipo;
  const userRole = userInfo.rol;

    // ---------------- INTENCIONES DE CURSOS ----------------

  // 0) "De esos cursos que me diste, ¿cuáles no son obligatorios?"
  if (/\bde esos cursos\b/.test(prompt) && /\bno son obligatorios\b/.test(prompt)) {
    const { data: userCursos, error } = await supabase
      .from("curso_usuario")
      .select("curso(titulo, obligatorio), estado")
      .eq("id_usuario", id_usuario);
    if (error) {
      return { response: "Ocurrió un error al consultar tus cursos." };
    }
    if (!userCursos || userCursos.length === 0) {
      return { response: "No tienes cursos asignados en este momento." };
    }
    const optionalcourses = (userCursos as unknown as { curso: { titulo: string; obligatorio: boolean }; estado: string }[])
      .filter(c => !c.curso.obligatorio);
    if (optionalcourses.length === 0) {
      return { response: "De tus cursos asignados, todos son obligatorios." };
    }
    const courseList = optionalcourses.map((c, i) => `${i + 1}. ${c.curso.titulo}`).join("\n");
    return {
      response: `De esos cursos que tienes asignados, estos NO son obligatorios:\n\n${courseList}`,
      actions: [{ label: "Ver todos mis cursos", href: "/cursos" }]
    };
  }

  // 1) "Mis cursos obligatorios"
  if (/\bmis cursos obligatorios\b/.test(prompt)) {
    const { data: usermandCourses, error } = await supabase
      .from("curso_usuario")
      .select("curso(titulo), estado")
      .eq("id_usuario", id_usuario)
      .eq("curso.obligatorio", true);
    if (error) {
      return { response: "Ocurrió un error al consultar tus cursos obligatorios." };
    }
    if (!usermandCourses || usermandCourses.length === 0) {
      return { response: `Hola ${userName}, no estás inscrito en ningún curso obligatorio.` };
    }
    const courseList = (usermandCourses as unknown as courseState[])
      .map((c, i) => `${i + 1}. ${c.curso.titulo} (estado: ${c.estado})`).join("\n");
    return {
      response: `Estos son tus cursos obligatorios:\n\n${courseList}`,
      actions: [{ label: "Ver todos mis cursos", href: "/cursos" }]
    };
  }

  // 2) "Mis cursos opcionales"
  if (/\bmis cursos opcionales\b/.test(prompt) || /\bmis cursos no obligatorios\b/.test(prompt)) {
    const { data: userOptCursos, error } = await supabase
      .from("curso_usuario")
      .select("curso(titulo), estado")
      .eq("id_usuario", id_usuario)
      .eq("curso.obligatorio", false);
    if (error) {
      return { response: "Ocurrió un error al consultar tus cursos opcionales." };
    }
    if (!userOptCursos || userOptCursos.length === 0) {
      return { response: `Hola ${userName}, no estás inscrito en ningún curso opcional.` };
    }
    const courseList = (userOptCursos as unknown as courseState[])
      .map((c, i) => `${i + 1}. ${c.curso.titulo} (estado: ${c.estado})`).join("\n");
    return {
      response: `Estos son tus cursos opcionales:\n\n${courseList}`,
      actions: [{ label: "Ver todos mis cursos", href: "/cursos" }]
    };
  }

  // 3) "Cursos completados"
  if (/\bcursos completados\b/.test(prompt) || /\bcursos terminados\b/.test(prompt) || /\bya termine\b/.test(prompt) || /\bya complete\b/.test(prompt)) {
    const { data: cursosCompletados, error } = await supabase
      .from("curso_usuario")
      .select("curso(titulo)")
      .eq("id_usuario", id_usuario)
      .eq("estado", "completado");
    if (error) {
      return { response: "Ocurrió un error al consultar tus cursos completados." };
    }
    if (!cursosCompletados || cursosCompletados.length === 0) {
      return { response: "No tienes ningún curso completado en este momento." };
    }
    const courseList = (cursosCompletados as unknown as { curso: { titulo: string } }[])
      .map((c, i) => `${i + 1}. ${c.curso.titulo}`).join("\n");
    return {
      response: `Estos son tus cursos completados:\n\n${courseList}`,
      actions: [{ label: "Ver todos mis cursos", href: "/cursos" }]
    };
  }

  // 4) "Cursos en progreso"
  if (/\bcursos en progreso\b/.test(prompt) || /\bcursos pendientes\b/.test(prompt) || /\bcursos sin terminar\b/.test(prompt) || /\baun no termino\b/.test(prompt)) {
    const { data: cursosProgreso, error } = await supabase
      .from("curso_usuario")
      .select("curso(titulo)")
      .eq("id_usuario", id_usuario)
      .eq("estado", "en_progreso");
    if (error) {
      return { response: "Ocurrió un error al consultar tus cursos en progreso." };
    }
    if (!cursosProgreso || cursosProgreso.length === 0) {
      return { response: `Hola ${userName}, no tienes cursos en progreso en este momento.` };
    }
    const courseList = (cursosProgreso as unknown as { curso: { titulo: string } }[])
      .map((c, i) => `${i + 1}. ${c.curso.titulo}`).join("\n");
    return {
      response: `Estos son tus cursos en progreso:\n\n${courseList}`,
      actions: [{ label: "Ver todos mis cursos", href: "/cursos" }]
    };
  }

  // 5) "Cursos sin comenzar"
  if (/\bcursos sin comenzar\b/.test(prompt) || /\bcursos no iniciados\b/.test(prompt) || /\bno he comenzado\b/.test(prompt) || /\bno he empezado\b/.test(prompt)) {
    const { data: cursosSinInicio, error } = await supabase
      .from("curso_usuario")
      .select("curso(titulo)")
      .eq("id_usuario", id_usuario)
      .eq("estado", "sin_comenzar");
    if (error) {
      return { response: "Ocurrió un error al consultar tus cursos sin empezar." };
    }
    if (!cursosSinInicio || cursosSinInicio.length === 0) {
      return { response: `Hola ${userName}, no tienes cursos sin comenzar en este momento.` };
    }
    const courseList = (cursosSinInicio as unknown as { curso: { titulo: string } }[])
      .map((c, i) => `${i + 1}. ${c.curso.titulo}`).join("\n");
    return {
      response: `Estos son tus cursos sin comenzar:\n\n${courseList}`,
      actions: [{ label: "Ver todos mis cursos", href: "/cursos" }]
    };
  }

  // 6) "Mis cursos" (todos los asignados)
  if (/\bmis cursos\b/.test(prompt) || /\bcursos asignados\b/.test(prompt) || /\bcursos inscritos\b/.test(prompt)) {
    const { data: cursos, error } = await supabase
      .from("curso_usuario")
      .select(
        "curso(id_curso, titulo, descripcion, duracion, obligatorio), estado"
      )
      .eq("id_usuario", id_usuario);
    if (error) {
      return { response: "Ocurrió un error al obtener tus cursos." };
    }
    if (!cursos || cursos.length === 0) {
      return { response: "No tienes cursos asignados o no estás inscrito en ningún curso." };
    }
    const coursesInfo = (cursos as unknown as Assignedcourse[])
      .map(c => ({
        id: c.curso.id_curso,
        titulo: c.curso.titulo,
        descripcion: c.curso.descripcion,
        duracion: c.curso.duracion,
        obligatorio: c.curso.obligatorio,
        estado: c.estado
      }))
      .sort((a, b) => a.titulo.localeCompare(b.titulo, "es", { sensitivity: "base" }));
    const courseList = coursesInfo.map((course, i) => `${i + 1}. ${course.titulo}`).join("\n");
    return {
      response: `Tus cursos asignados son:\n\n${courseList}`,
      actions: [{ label: "Ir a mis cursos", href: "/cursos" }]
    };
  }

  // 7) "Oferta de cursos" / "Cursos opcionales" (tabla global)
  if (/\boferta de cursos\b/.test(prompt) || /\bcursos no obligatorios\b/.test(prompt) || /\bcursos opcionales\b/.test(prompt)) {
    const { data: optCursos, error } = await supabase
      .from("curso")
      .select("titulo")
      .eq("obligatorio", false);
    if (error) {
      return { response: "Ocurrió un error al consultar la oferta de cursos." };
    }
    if (!optCursos || optCursos.length === 0) {
      return { response: "Actualmente no hay cursos disponibles como opcionales." };
    }
    const courseList = (optCursos as unknown as { titulo: string }[])
      .map((c, i) => `${i + 1}. ${c.titulo}`).join("\n");
    return {
      response: `Estos son los cursos opcionales (oferta):\n\n${courseList}`,
      actions: [{ label: "Ver oferta completa de cursos", href: "/cursos" }]
    };
  }

  // 8) "Cursos obligatorios" (tabla global)
  if (/\bcursos obligatorios\b/.test(prompt) || /\blista cursos obligatorios\b/.test(prompt) || /\bcuales cursos obligatorios\b/.test(prompt)) {
    const { data: mandCourses, error } = await supabase
      .from("curso")
      .select("titulo")
      .eq("obligatorio", true);
    if (error) {
      return { response: "Ocurrió un error al consultar los cursos obligatorios." };
    }
    if (!mandCourses || mandCourses.length === 0) {
      return { response: "Actualmente no hay cursos marcados como obligatorios." };
    }
    const courseList = (mandCourses as unknown as { titulo: string }[])
      .map((c, i) => `${i + 1}. ${c.titulo}`).join("\n");
    return {
      response: `Estos son los cursos obligatorios:\n\n${courseList}`,
      actions: [{ label: "Ver oferta completa de cursos", href: "/cursos" }]
    };
  }

  // 9) Datos específicos de un curso por número
  const matchNumero = rawPrompt.match(/curso\s+(\d+)/i);
  if (matchNumero) {
    const nro = parseInt(matchNumero[1], 10);
    if (!isNaN(nro)) {
      const { data: cursosAll, error } = await supabase
        .from("curso_usuario")
        .select("curso(id_curso, titulo, descripcion, duracion, obligatorio), estado")
        .eq("id_usuario", id_usuario);
      if (error || !cursosAll) {
        return { response: "Ocurrió un error al obtener tus cursos." };
      }
      const coursesInfoAll = (cursosAll as unknown as Assignedcourse[])
        .map(c => ({
          id: c.curso.id_curso,
          titulo: c.curso.titulo,
          descripcion: c.curso.descripcion,
          duracion: c.curso.duracion,
          obligatorio: c.curso.obligatorio,
          estado: c.estado
        }))
        .sort((a, b) => a.titulo.localeCompare(b.titulo, "es", { sensitivity: "base" }));
      if (nro < 1 || nro > coursesInfoAll.length) {
        return { response: `Solo tienes ${coursesInfoAll.length} cursos asignados. Ingresa un número entre 1 y ${coursesInfoAll.length}.` };
      }
      const cursoSeleccionado = coursesInfoAll[nro - 1];
      if (prompt.includes("titulo") || prompt.includes("nombre")) {
        return { response: `El título del curso ${nro} es: ${cursoSeleccionado.titulo}` };
      } else if (prompt.includes("descripcion") || prompt.includes("informacion")) {
        return { response: `La descripción del curso ${nro} es: ${cursoSeleccionado.descripcion}` };
      } else if (prompt.includes("duracion") || prompt.includes("tiempo")) {
        return { response: `La duración del curso ${nro} es de ${cursoSeleccionado.duracion} minutos.` };
      } else if (prompt.includes("obligatorio") || prompt.includes("tipo")) {
        return { response: `El curso ${nro} es ${cursoSeleccionado.obligatorio ? "obligatorio" : "opcional"}.` };
      } else if (prompt.includes("estado") || prompt.includes("progreso")) {
        return { response: `El estado del curso ${nro} es: ${cursoSeleccionado.estado}.` };
      } else {
        return {
          response: `Información del curso ${nro}:\n` +
                    `• Título: ${cursoSeleccionado.titulo}\n` +
                    `• Descripción: ${cursoSeleccionado.descripcion}\n` +
                    `• Duración: ${cursoSeleccionado.duracion} minutos\n` +
                    `• Obligatorio: ${cursoSeleccionado.obligatorio ? "Sí" : "No"}\n` +
                    `• Estado: ${cursoSeleccionado.estado}.`
        };
      }
    }
  }

  // intencion: quien es mi lider
  if (["quien es mi lider", "quien es mi jefe", "quien es mi supervisor"].some(kw => prompt.includes(normalizeText(kw)))) {
    if (userRole === "administrador") {
      return { response: "Como administrador no tienes lider asignado o lider directo. Si necesitas asisencia yo te puedo apoyar, ¿Como te ayudo?" };
    } else {
      let liderName = "líder desconocido";
      if (idTeam){
        const { data: eqData } = await supabase
          .from("equipo_trabajo")
          .select("nombre, id_administrador")
          .eq("id_equipo", idTeam)
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
      return { 
        response: `Tu líder es ${liderName}. Si necesitas ayuda, no dudes en preguntar.` ,
      };
    }
  }

  // 3) Obtener información de equipo y líder
  let nombreEquipo = "equipo desconocido";
  let liderName = "líder desconocido";
  if (idTeam) {
    const { data: eqData } = await supabase
      .from("equipo_trabajo")
      .select("nombre, id_administrador")
      .eq("id_equipo", idTeam)
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

  // 3) RAG: búsqueda con Fuse.js para armar el contexto
  const fuse = new Fuse(politicas, {
    keys: ["title", "description", "content"],
    threshold: 0.6,
    ignoreLocation: true,
    includeScore: true,
    minMatchCharLength: 3,
  });

  // 3.1) Intentamos buscar con Fuse (resultados “auténticos”)
  const fuseResults = fuse.search(prompt);

  // 3.2) Variables para saber si usamos fallback o no
  let useFallback = false;
  let searchResults = fuseResults;

  // 3.3) Si Fuse no arrojó nada, aplicamos el fallback de substring
  if (!fuseResults.length) {
    useFallback = true;
    searchResults = politicas
      .filter(p => {
        const combinado = normalizeText(p.title + " " + p.description + " " + p.content);
        return prompt
          .split(" ")
          .some(w => w.length > 3 && combinado.includes(w));
      })
      .map((item, index) => ({ item, score: 0, refIndex: index }));
  }

  // 3.4) Armar el knowledgeContext (top 3) usando searchResults
  const topSections = searchResults
    .sort((a, b) => a.score! - b.score!)
    .slice(0, 3)
    .map(r => {
      const { title, description, content } = r.item;
      return [`## ${title}`, description, content].join("\n\n");
    });

  const knowledgeContext = topSections.length
    ? topSections.join("\n\n---\n\n")
    : "No se encontró información relevante en las políticas.";

  // 4) Construir matchedPolicies SÓLO con aquellos resultados de Fuse que sean “acciónables”
  //    y NO usar fallback para generar botones.
  const actionablePolicyIds = new Set([
    "neoris",
    "cursos",
    "timecard",
    "dashboard",
    "retos",
    "mi_perfil"
  ]);

  let matchedPolicies: typeof politicas = [];
  if (!useFallback) {
    // Filtramos fuseResults únicamente por IDs “acciónables”
    matchedPolicies = fuseResults
      .filter(r => {
    const id = r.item.id.toLowerCase();
    return (
      actionablePolicyIds.has(id) &&
      prompt.split(/\s+/).includes(id)  // verifica existencia exacta como palabra
    );
  })
  .sort((a, b) => a.score! - b.score!)
  .slice(0, 3)
  .map(r => r.item);
  }

  // 5) Generar policyActions a partir de matchedPolicies filtradas:
  const policyActions: Action[] = matchedPolicies.map(pol => ({
    label: pol.title,
    href: "/" + pol.id
  }));
  
    // 4) Cargar historial de mensajes (sin saludo)
  const { data: history } = await supabase
    .from("mensajes")
    .select("input_usuario, output_bot")
    .eq("id_usuario", id_usuario)
    .order("timestamp", { ascending: true })
    .limit(5);

  type Message = { role: "system" | "user" | "assistant"; content: string };
  const historial: Message[] = history
    ? history
        .slice()
        .reverse()
        .flatMap(msg => [
          ...(msg.input_usuario ? [{ role: "user" as const, content: msg.input_usuario }] : []),
          ...(msg.output_bot ? [{ role: "assistant" as const, content: msg.output_bot }] : []),
        ])
    : [];

  // 5) Construir mensaje de sistema con contexto y metadata
  const systemMessage = [
    `Eres Compi, asistente virtual para onboarding en Neoris.

    Usa únicamente esta información de políticas:
    ${knowledgeContext}

    Información del usuario:
    - Nombre: ${userName}
    - Puesto: ${userPosition}
    - Equipo: ${nombreEquipo}
    - Líder: ${liderName}

    Responde de forma amigable y profesional.`
  ].join("\n");

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
    await supabase.from("mensajes").insert([{ 
      id_usuario, 
      input_usuario: rawPrompt, 
      output_bot: answer, 
      timestamp: new Date().toISOString()
    }]);

    return { 
      response: answer,
      actions: policyActions 
    };
  } catch (error) {
    console.error("Error en OpenAI:", error);
    return { error: "Error al procesar la respuesta" };
  }
}
