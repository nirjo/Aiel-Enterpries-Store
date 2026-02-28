import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// Build-time safe placeholder — prevents @supabase/ssr from throwing during static generation
const PLACEHOLDER_URL = "http://placeholder.invalid";
const PLACEHOLDER_KEY = "placeholder";

export function createClient() {
    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim() || PLACEHOLDER_URL;
    const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim() || PLACEHOLDER_KEY;

    return createBrowserClient<Database>(url, key);
}

// Singleton client for browser
let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
    if (!browserClient) {
        browserClient = createClient();
    }
    return browserClient;
}
