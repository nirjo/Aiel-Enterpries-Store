import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Creates a Supabase Admin client with full access to the database and auth system.
 * WARNING: This client bypasses RLS policies. It should ONLY be used in restricted
 * server actions or API routes, never exposed to the client.
 */
export function getSupabaseAdmin() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
    }

    // Create a single supabase client for interacting with your database
    return createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
