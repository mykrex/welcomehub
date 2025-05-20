'use client';

//import { createBrowserClient } from '@supabase/ssr';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

//const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export const supabase = createBrowserSupabaseClient();
