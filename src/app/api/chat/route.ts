// src/app/api/chat/route.ts (for Next.js 13/14 app directory)

import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

//console.log("API KEY:", process.env.OPENAI_API_KEY);


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt) {
      return NextResponse.json({ error: "Falta el prompt" }, { status: 400 });
    }

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un asistente útil y amigable para nuevos empleados que están haciendo onboarding." },
        { role: "user", content: prompt },
      ],
    });

    const answer = chatResponse.choices[0].message.content;

    return NextResponse.json({ response: answer });
  } catch (error: any) {
    console.error("Error con la API de OpenAI:", error); // 👈 esta línea
    return NextResponse.json(
      { error: "Hubo un error al procesar tu solicitud." },
      { status: 500 }
    );
  }
}
