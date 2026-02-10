"use client";

import { getSupabaseClient } from "./supabase/client";
import type { Profile } from "@/types/database";

/**
 * Sign in with Google OAuth
 * Opens Google popup and redirects to /account on success
 */
export async function signInWithGoogle(redirectTo?: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}/auth/callback${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
            queryParams: {
                access_type: "offline",
                prompt: "consent",
            },
        },
    });

    if (error) {
        console.error("Google sign in error:", error);
        throw error;
    }

    return data;
}

/**
 * Sign in with Email OTP (Magic Link)
 * Sends a 6-digit OTP code to the user's email
 */
export async function signInWithEmail(email: string) {
    const supabase = getSupabaseClient();

    // Get origin safely (only available on client)
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    console.log("Sending OTP to:", email);

    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            // Allow new users to sign up
            shouldCreateUser: true,
            // Redirect URL after clicking magic link (if they click the link instead of using OTP)
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        console.error("Email sign in error:", error.message, error);
        throw error;
    }

    console.log("OTP sent successfully:", data);
    return data;
}

/**
 * Verify the OTP code sent to email
 */
export async function verifyOtp(email: string, token: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
    });

    if (error) {
        console.error("OTP verification error:", error);
        throw error;
    }

    return data;
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
