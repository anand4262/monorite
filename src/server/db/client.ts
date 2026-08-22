import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

/** Lazily creates the Supabase client on first use, from server-only env
 * vars — never `NEXT_PUBLIC_*`, since this uses the service_role key
 * (full read/write access, bypasses row-level security), which must never
 * reach client-side JS. Returns null when unconfigured so every caller can
 * no-op gracefully, the same pattern as the OpenAI/Resend/Telegram
 * integrations elsewhere in this codebase — a fresh clone or a deploy
 * without these env vars still works, it just doesn't persist to a
 * database. */
export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return client;
}
