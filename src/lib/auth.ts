"use client";

import { getSupabaseClient } from "./supabase/client";
import type { Profile } from "@/types/database";

/**
 * Sign in with Google OAuth
 * Opens Google popup and redirects to /account on success
 */
export async function signInWithGoogle(redirectTo?: string) {
    const supabase = getSupabaseClient();
    const fullRedirectUrl = `${window.location.origin}/auth/callback${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`;
    console.log("Supabase Auth Redirect URL being sent:", fullRedirectUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: fullRedirectUrl,
            queryParams: {
                access_type: "offline",
                prompt: "select_account consent",
            },
        },
    });

    if (error) {
        console.error("Google sign in error:", error);
        throw error;
    }

    return data;
}

export async function signInWithEmail(email: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    console.log("Sending OTP via custom Resend sender to:", email);

    // Using our custom server action instead of supabase's built in magic-link 
    // to bypass the unverified domain issue on Resend.
    const { sendEmailOTP } = await import('@/app/actions/auth-email');
    const result = await sendEmailOTP(email);

    if (!result.success) {
        console.error("Email sign in error:", result.error);
        throw new Error(result.error || "Failed to send OTP code.");
    }

    console.log("OTP sent successfully");
    // Store isNewUser hint for the client in localStorage temporarily 
    // so we know if we should prompt for a Name and Password on verifying.
    if (typeof window !== "undefined") {
        if (result.isNewUser) {
            localStorage.setItem("auth_new_user", "true");
        } else {
            localStorage.removeItem("auth_new_user");
        }
    }

    return result;
}

export async function verifyOtp(email: string, token: string, password?: string, name?: string) {
    const isNewUser = typeof window !== "undefined" && localStorage.getItem("auth_new_user") === "true";
    let res;

    if (isNewUser) {
        const { verifyOTPAndSignup } = await import('@/app/actions/auth-email');
        const finalName = name || email.split('@')[0];
        const finalPassword = password || (Math.random().toString(36).slice(-12) + "A1!");
        res = await verifyOTPAndSignup(email, finalName, finalPassword, token);
    } else {
        const { verifyOTPAndLogin } = await import('@/app/actions/auth-email');
        res = await verifyOTPAndLogin(email, token);
    }

    if (!res.success) {
        throw new Error(res.error || "Invalid OTP code");
    }

    if (typeof window !== "undefined") localStorage.removeItem("auth_new_user");

    // Force supabase auth listener to update the session from the cookies set by server action!
    const supabase = getSupabaseClient();
    await supabase.auth.getSession();
    await supabase.auth.refreshSession();

    return { session: true };
}

/**
 * Sign out the current user
 */
export async function signOut() {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Sign out error:", error);
        throw error;
    }
}

/**
 * Get the current session
 */
export async function getSession() {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.error("Get session error:", error);
        return null;
    }
    return data.session;
}

/**
 * Get the current user
 */
export async function getUser() {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.error("Get user error:", error);
        return null;
    }
    return data.user;
}

/**
 * Fetch user profile from profiles table
 */
export async function getProfile(userId: string): Promise<Profile | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single() as { data: Profile | null; error: unknown };

    if (error) {
        // Profile might not exist yet (trigger should create it)
        console.error("Get profile error:", error);
        return null;
    }

    return data;
}

/**
 * Sync Google user metadata to profile
 * Note: The handle_new_user trigger creates the initial profile.
 * This function augments the profile with additional Google metadata.
 */
export async function syncGoogleProfile(userId: string): Promise<Profile | null> {
    const user = await getUser();
    if (!user) return null;

    // Get existing profile - it should be created by the trigger
    let profile = await getProfile(userId);

    // If profile doesn't exist yet, wait a moment and try again
    // (trigger might still be processing)
    if (!profile) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        profile = await getProfile(userId);
    }

    // If profile exists but is missing avatar/name, enhance it with user metadata
    if (profile) {
        const googleMetadata = user.user_metadata;

        // Return enhanced profile object with Google data
        // The UI will display this data even if not persisted
        return {
            ...profile,
            avatar_url: profile.avatar_url || googleMetadata?.avatar_url || googleMetadata?.picture || null,
            full_name: profile.full_name || googleMetadata?.full_name || googleMetadata?.name || null,
        };
    }

    // Create mock profile from user metadata if trigger hasn't run
    if (!profile && user.email) {
        const googleMetadata = user.user_metadata;
        return {
            id: userId,
            email: user.email,
            full_name: googleMetadata?.full_name || googleMetadata?.name || null,
            phone: null,
            role: "customer" as const,
            avatar_url: googleMetadata?.avatar_url || googleMetadata?.picture || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
    }

    return profile;
}
