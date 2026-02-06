import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const redirectTo = requestUrl.searchParams.get("redirectTo") || "/account";
    const error = requestUrl.searchParams.get("error");
    const errorDescription = requestUrl.searchParams.get("error_description");

    // Handle OAuth errors
    if (error) {
        console.error("OAuth error:", error, errorDescription);
        return NextResponse.redirect(
            new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
        );
    }

    if (code) {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) => {
                                cookieStore.set(name, value, options);
                            });
                        } catch (error) {
                            // Handle cookie setting errors in middleware
                            console.error("Error setting cookies:", error);
                        }
                    },
                },
            }
        );

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
            console.error("Code exchange error:", exchangeError);
            return NextResponse.redirect(
                new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
            );
        }

        // Redirect to the specified page after successful auth
        return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
    }

    // No code provided, redirect to login
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
