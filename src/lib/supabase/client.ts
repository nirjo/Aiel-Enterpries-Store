import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error("Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }
    return createBrowserClient<Database>(
        SUPABASE_URL || "https://placeholder.supabase.co",
        SUPABASE_ANON_KEY || "placeholder-key"
    );
}

// Singleton client for browser
let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
    if (!browserClient) {
        browserClient = createClient();
    }
    return browserClient;
}
