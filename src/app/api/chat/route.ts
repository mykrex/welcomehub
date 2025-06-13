

import { NextRequest, NextResponse } from "next/server";
import { handleChatRequest } from "@/utils/handleChatRequest"; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await handleChatRequest(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ response: result.response, actions: result.actions });
  } catch (error) {
    console.error("Error en el handler:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
