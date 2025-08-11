// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies as getCookies } from "next/headers";

// versão compatível com Next onde cookies() pode ser Promise
export async function createSupabaseServerClient() {
  const maybe = getCookies() as any;
  const cookieStore = typeof maybe?.then === "function" ? await maybe : maybe;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // precisa retornar string | undefined
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          } catch {}
        },
      },
    }
  );
}

// também exporta como default (evita erro de import)
export default createSupabaseServerClient;
