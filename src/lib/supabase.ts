import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client: SupabaseClient | null = null;

/**
 * Returns a server-side Supabase client using the service role key.
 * This client bypasses RLS and should only be used in server-side code
 * (API routes, webhooks, server components).
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL is not set in environment variables");
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set in environment variables"
    );
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return client;
}
