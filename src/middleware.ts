import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { data: perfil } = await supabase
    .from("usuario")
    .select("rol")
    .eq("id_usuario", user.id)
    .single();

  const rol = perfil?.rol;

  const url = req.nextUrl.clone();

  if (
    (url.pathname === "/miequipo" || url.pathname.startsWith("/miequipo/")) &&
    rol !== "administrador"
  ) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: [],
};
