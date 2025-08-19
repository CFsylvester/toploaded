import 'server-only';
import { cookies } from 'next/headers';
import type { Database } from '@/types/db';
import { createServerClient } from '@supabase/ssr';

export const sbServer = async () => {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...options })
            );
          } catch {
            // Server Component context
          }
        },
      },
    }
  );
};
