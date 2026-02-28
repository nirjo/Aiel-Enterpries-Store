import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

// Build-time safe placeholders — @supabase/ssr throws on empty strings
const PLACEHOLDER_URL = "http://placeholder.invalid";
const PLACEHOLDER_KEY = "placeholder";

export async function createClient() {
    const cookieStore = await cookies();
    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim() || PLACEHOLDER_URL;
    const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim() || PLACEHOLDER_KEY;

    return createServerClient<Database>(url, key, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    // Server component - ignore cookie setting errors
                }
            },
        },
    });
}

// Admin client with service role for server-side operations
export async function createAdminClient() {
    const cookieStore = await cookies();
    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim() || PLACEHOLDER_URL;
    const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim() || PLACEHOLDER_KEY;

    return createServerClient<Database>(url, serviceKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    // Server component - ignore cookie setting errors
                }
            },
        },
    });
}
