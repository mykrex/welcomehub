import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { supabase } from "@/lib/supabase";
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

    // traer el historial de mensajes del usuario
    const { data: history, error: historyError } = await supabase
      .from("mensajes")
      .select("id_usuario, output_bot")
      .eq("id_usuario", id_usuario)
      .order("timestamp", { ascending: false })
      .limit(5);

      if (historyError) {
        console.error("Error al traer el historial de mensajes:", historyError.message);
      }

      const messages: ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: "Eres un asistente útil y amigable para nuevos empleados que están haciendo onboarding.",
        },
        ...(history?.reverse().flatMap((item)=> [
          {role: "user" as const, content: item.id_usuario},
          {role: "assistant" as const, content: item.output_bot},
        ]) ?? []),
        { role: "user" as const, content: prompt },
      ];

    // llamada a openAI
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const answer = chatResponse.choices[0].message.content;

    // Guardar la conversación en la base de datos
    const { error: dbError } = await supabase.from("mensajes").insert([
      {
        id_usuario,
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
