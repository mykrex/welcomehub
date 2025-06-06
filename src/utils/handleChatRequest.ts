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
type CursoTitulo = {
  curso: {
    titulo: string;
  };
};
type CursoAsignado = {
  curso: {
    id_curso: string;
    titulo: string;
    descripcion: string;
    duracion: number;
    obligatorio: boolean;
  };
  estado: string;
};
type CursoSimple = {
  titulo: string;
}
type CursoEstado = {
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
  const idEquipo = userInfo.id_equipo;
  const userRole = userInfo.rol;

  // Detectar intenciones especificas (cursos, lider, etc)
  // INTENCION: cursos completados, en progreso, sin comenzar
  const palabrasCompletados = ["cursos completados", "cursos ya completos", "cursos terminados", "ya termine", "ya termine"];
  const palabrasEnProgreso = ["cursos en progreso", "cursos pendientes", "cursos sin terminar", "no he terminado", "faltan por completar", "faltan por terminar"];
  const palabrasSinComenzar = ["cursos sin comenzar", "cursos no iniciados", "cursos sin iniciar", "no he empezado", "sin iniciar", "no he iniciado", "no he comenzado"];

  // cursos completados
  if (palabrasCompletados.some(kw => prompt.includes(kw))){
    const {data: cursosCompletados, error: errorCompletados } = await supabase  
      .from("curso_usuario")
      .select("curso(titulo)")
      .eq("id_usuario", id_usuario)
      .eq("estado", "completado");
    if (errorCompletados) {
      return { response: "Ocurrio un error al consultar tus cursos completados."};
    }
    if (!cursosCompletados || cursosCompletados.length === 0) {
      return { response: "No tienes ningun curso completado en este momento" };
    }
    const lista = (cursosCompletados as unknown as CursoTitulo[])
          .map((c, i) => `${i+1}. ${c.curso.titulo}`)
          .join("\n");
    return {
      response: `Estos son tus cursos completados:\n\n${lista}`,
      actions: [{ label: "Ver todos mis cursos", href: "/cursos"}]
    }
  }

  // cursos en progreso
  if (palabrasEnProgreso.some(kw => prompt.includes(kw))){
    const { data: cursosProgreso, error: errorProgreso } = await supabase 
      .from("curso_usuario")
      .select("curso(titulo)")
      .eq("id_usuario", id_usuario)
      .eq("estado", "en_progreso");
    if (errorProgreso) {
      return { response: "Ocurrió un error al consultar tus cursos en progreso." };
    }
    if (!cursosProgreso || cursosProgreso.length === 0) {
      return { response: `Hola ${userName}, no tienes cursos en progreso en este momento.` };
    }
    const lista = (cursosProgreso as unknown as CursoTitulo[])
          .map((c, i) => `${i+1}. ${c.curso.titulo}`)
          .join("\n");
    return {
      response: `Estos son tus cursos en progreso:\n\n${lista}`,
      actions: [{ label: "Ver todos mis cursos", href: "/cursos" }]
    };
  }

  // cursos sin comenzar
  if (palabrasSinComenzar.some(kw => prompt.includes(kw))) {
    const { data: cursosSinInicio, error: errorSinInicio } = await supabase
      .from("curso_usuario")
      .select("curso(titulo)")
      .eq("id_usuario", id_usuario)
      .eq("estado", "sin_comenzar");
    if (errorSinInicio) {
      return { response: "Ocurrió un error al consultar tus cursos sin empezar." };
    }
    if (!cursosSinInicio || cursosSinInicio.length === 0) {
      return { response: `Hola ${userName}, no tienes cursos sin comenzar en este momento.` };
    }
    const lista = (cursosSinInicio as unknown as CursoTitulo[])
          .map((c, i) => `${i+1}. ${c.curso.titulo}`)
          .join("\n");
    return {
      response: `Estos son tus cursos sin comenzar:\n\n${lista}`,
      actions: [{ label: "Ver todos mis cursos", href: "/cursos" }]
    };
  }

  // detectar cursos obligatorios, oferta


  // INTENCION: cursos obligatorios
  if (
    ["cursos obligatorios", "lista cursos obligatorios", "cuales cursos obligatorios"].some(
      kw => prompt.includes(kw)
    )
  ) {
    const { data: mandCursos, error: mandError } = await supabase
      .from("curso")
      .select("titulo")
      .eq("obligatorio", true);

    if (mandError) {
      return { response: "Ocurrió un error al consultar los cursos obligatorios." };
    }
    if (!mandCursos || mandCursos.length === 0) {
      return { response: "Actualmente no hay cursos marcados como obligatorios." };
    }
    const listaMand = mandCursos
      .map((c: CursoSimple, i: number) => `${i + 1}. ${c.titulo}`)
      .join("\n");
    return {
      response: `Estos son los cursos obligatorios:\n\n${listaMand}`,
      actions: [{ label: "Ver oferta completa de cursos", href: "/cursos" }]
    };
  }

  // Intencion: oferta de cursos
  if (
    ["oferta de cursos", "cursos no obligatorios", "cursos opcionales", "cuales cursos opcionales"].some(
      kw => prompt.includes(kw)
    )
  ) {
    const { data: optCursos, error: optError } = await supabase
      .from("curso")
      .select("titulo")
      .eq("obligatorio", false);

    if (optError) {
      return { response: "Ocurrió un error al consultar la oferta de cursos." };
    }
    if (!optCursos || optCursos.length === 0) {
      return { response: "Actualmente no hay cursos disponibles como opcionales." };
    }
    const listaOpt = optCursos
      .map((c: CursoSimple, i: number) => `${i + 1}. ${c.titulo}`)
      .join("\n");
    return {
      response: `Estos son los cursos opcionales (oferta):\n\n${listaOpt}`,
      actions: [{ label: "Ver oferta completa de cursos", href: "/cursos" }]
    };
  }

  // Intencion: cursos obligatorios del usuario
  if (
    ["mis cursos obligatorios", "cursos obligatorios que tengo"].some(
      kw => prompt.includes(kw)
    )
  ) {
    const { data: userMandCursos, error: umcError } = await supabase
      .from("curso_usuario")
      .select("curso(titulo), estado")
      .eq("id_usuario", id_usuario)
      .eq("curso.obligatorio", true); // filtramos sólo los obligatorios en la relación

    if (umcError) {
      return { response: "Ocurrió un error al consultar tus cursos obligatorios." };
    }
    if (!userMandCursos || userMandCursos.length === 0) {
      return { response: `Hola ${userName}, no estás inscrito en ningún curso obligatorio.` };
    }
    const listaUserMand = (userMandCursos as unknown as CursoEstado[])
      .map((c, i) => `${i + 1}. ${c.curso.titulo} (estado: ${c.estado})`)
      .join("\n");
    return {
      response: `Estos son tus cursos obligatorios:\n\n${listaUserMand}`,
      actions: [{ label: "Ver todos mis cursos", href: "/cursos" }]
    };
  }

  // Intencion: cursos opcionales
  if (
    ["mis cursos opcionales", "cursos opcionales que tengo", "mis cursos no obligatorios"].some(
      kw => prompt.includes(kw)
    )
  ) {
    const { data: userOptCursos, error: uocError } = await supabase
      .from("curso_usuario")
      .select("curso(titulo), estado")
      .eq("id_usuario", id_usuario)
      .eq("curso.obligatorio", false); // filtramos sólo los opcionales

    if (uocError) {
      return { response: "Ocurrió un error al consultar tus cursos opcionales." };
    }
    if (!userOptCursos || userOptCursos.length === 0) {
      return { response: `Hola ${userName}, no estás inscrito en ningún curso opcional.` };
    }
    const listaUserOpt = (userOptCursos as unknown as CursoEstado[])
      .map((c, i) => `${i + 1}. ${c.curso.titulo} (estado: ${c.estado})`)
      .join("\n");
    return {
      response: `Estos son tus cursos opcionales:\n\n${listaUserOpt}`,
      actions: [{ label: "Ver todos mis cursos", href: "/cursos" }]
    };
  }

  // intencion: "mis cursos"
  if (["mis cursos", "cursos asignados", "cursos inscritos"].some(kw => prompt.includes(normalizeText(kw)))){
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
    const coursesInfo = (cursos as unknown as CursoAsignado[]).map(c => ({
      id: c.curso.id_curso,
      titulo: c.curso.titulo,
      descripcion: c.curso.descripcion,
      duracion: c.curso.duracion,
      obligatorio: c.curso.obligatorio,
      estado: c.estado
    }))
    .sort((a, b) => a.titulo.localeCompare(b.titulo, "es", { sensitivity: "base" })); // Ordenar por título en español

    // Mostramos los cursos asignados
    const listaCursos = coursesInfo.map((course, i) => `${i + 1}. ${course.titulo}`).join("\n");
    return { 
      response: `Tus cursos asignados son:\n\n${listaCursos}`,
      actions: [
        { label: "Ir a mis cursos", href: "/cursos"}
      ]
    };
  }

  // intencion: datos especificos de curso
  const matchNumero = rawPrompt.match(/curso\s+(\d+)/i);
  if (matchNumero) {
    const nro = parseInt(matchNumero[1], 10);
    if(!isNaN(nro)){
      const { data: cursosAll, error: cursosAllError } = await supabase
        .from("curso_usuario")
        .select("curso(id_curso, titulo, descripcion, duracion, obligatorio), estado")
        .eq("id_usuario", id_usuario);
      if (cursosAllError || !cursosAll){
        return { response: "Ocurrió un error al obtener tus cursos." };
      }
      const coursesInfoAll = (cursosAll as unknown as CursoAsignado[]).map(c => ({
        id: c.curso.id_curso,
        titulo: c.curso.titulo,
        descripcion: c.curso.descripcion,
        duracion: c.curso.duracion,
        obligatorio: c.curso.obligatorio,
        estado: c.estado
        }))
        .sort((a, b) => a.titulo.localeCompare(b.titulo, "es", { sensitivity: "base" })); // Ordenar por título en español
      
      if (nro < 1 || nro > coursesInfoAll.length) {
        return { response: `Solo tienes ${coursesInfoAll.length} cursos asignados. Ingresa un número entre 1 y ${coursesInfoAll.length}.` }
      }

      // extraemos el curso correspondiente
      const cursoSeleccionado = coursesInfoAll[nro -1 ];

      // dependiendo de la pregunta, respondemos
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
      return { 
        response: `Tu líder es ${liderName}. Si necesitas ayuda, no dudes en preguntar.` ,
      };
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
