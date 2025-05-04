import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const value = cookieStore.get(name)?.value;
          console.log(`🍪 Cookie [${name}] = ${value}`);
          return value;
        },
        set(name, value, options) {
          cookieStore.set(name, value, options);
        },
        remove(name, options) {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  const { data: { session }, error } = await supabase.auth.getSession();

  console.log("🧠 Supabase Session:", session);
  console.log("🔴 Supabase Error:", error);

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const {
    data: userData,
    error: userError
  } = await supabase
    .from('usuario')
    .select('*')
    .eq('id_usuario', session.user.id)
    .single();

  if (userError || !userData) {
    return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
  }

  return NextResponse.json(userData);
}
