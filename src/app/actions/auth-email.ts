"use server";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/resend";
import { AuthEmail } from "@/emails/AuthEmail";
import { render } from "@react-email/components";
import React from "react";

/**
 * Generate a 6-digit random OTP
 */
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Check if email exists, create dummy user if not, and send OTP
 */
export async function sendEmailOTP(email: string) {
    try {
        const adminAuth = getSupabaseAdmin().auth;
        const supabase = await createClient();

        // Check if user exists in the profiles table because auth.users is hard to query directly
        // Alternatively, use admin.listUsers if we want to check auth level
        // For security against enumeration, we always return "success" but only to the owner

        // Query profile table
        const { data: profile } = await getSupabaseAdmin()
            .from("profiles")
            .select("id")
            .eq("email", email)
            .single() as { data: { id: string } | null, error: any };

        let userId = profile?.id;
        let isNewUser = false;
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

        if (!userId) {
            // New user scenario
            const { data: newUser, error: createError } = await adminAuth.admin.createUser({
                email,
                email_confirm: true, // Auto confirm so they can login immediately
                user_metadata: {
                    pending_otp: otp,
                    otp_expiry: otpExpiry,
                },
            });

            if (createError) {
                console.error("Failed to create new user:", createError);
                return { success: false, error: "Authentication failed. Please try again." };
            }
            userId = newUser.user.id;
            isNewUser = true;
        } else {
            // Existing user scenario
            // Update their metadata with the new OTP
            const { error: updateError } = await adminAuth.admin.updateUserById(userId, {
                user_metadata: {
                    pending_otp: otp,
                    otp_expiry: otpExpiry,
                },
            });
            if (updateError) {
                console.error("Failed to update user OTP:", updateError);
                return { success: false, error: "Failed to generate login code." };
            }
        }

        // Render email template to HTML to avoid Next.js Server Action serialization issues
        const html = await render(React.createElement(AuthEmail, { otp, isNewUser }));

        // Send Email via Resend
        await sendEmail({
            to: email,
            subject: isNewUser ? "Welcome! Your Aiel Enterprises sign up code" : "Your Aiel Enterprises login code",
            html,
        });

        return { success: true, isNewUser };
    } catch (error: any) {
        console.error("Error in sendEmailOTP:", error);
        return { success: false, error: error?.message || "An unexpected error occurred." };
    }
}

/**
 * Verify OTP and sign up (for new users setting name and password)
 */
export async function verifyOTPAndSignup(email: string, name: string, password: string, otp: string) {
    try {
        const adminAuth = getSupabaseAdmin().auth;

        // Fetch user from auth to check metadata
        const { data: { users }, error: listError } = await adminAuth.admin.listUsers();
        if (listError) return { success: false, error: "Database error" };

        const user = users.find((u) => u.email === email);
        if (!user) return { success: false, error: "User not found" };

        const metadata = user.user_metadata;
        if (metadata.pending_otp !== otp) {
            return { success: false, error: "Invalid verification code" };
        }

        if (new Date(metadata.otp_expiry) < new Date()) {
            return { success: false, error: "Verification code expired. Please request a new one." };
        }

        // Set password, name, and clear OTP
        const { error: updateError } = await adminAuth.admin.updateUserById(user.id, {
            password: password,
            user_metadata: {
                ...metadata,
                full_name: name,
                pending_otp: null,
                otp_expiry: null,
            },
        });

        if (updateError) return { success: false, error: "Failed to create account" };

        // Finally, sign them in with Supabase Server Client to establish the session cookie
        const supabase = await createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) return { success: false, error: "Account created, but failed to automatically log in." };

        return { success: true };
    } catch (error: any) {
        console.error("Signup verify error:", error);
        return { success: false, error: error?.message || "An unexpected error occurred." };
    }
}

/**
 * Verify OTP and login (for existing users)
 */
export async function verifyOTPAndLogin(email: string, otp: string) {
    try {
        const adminAuth = getSupabaseAdmin().auth;

        const { data: { users }, error: listError } = await adminAuth.admin.listUsers();
        if (listError) return { success: false, error: "Database error" };

        const user = users.find((u) => u.email === email);
        if (!user) return { success: false, error: "User not found" };

        const metadata = user.user_metadata;
        if (metadata.pending_otp !== otp) {
            return { success: false, error: "Invalid verification code" };
        }

        if (new Date(metadata.otp_expiry) < new Date()) {
            return { success: false, error: "Verification code expired. Please request a new one." };
        }

        // Generate a random temporary password or use a magic link session
        // A temporary deterministic password just for this session minting
        const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12) + "A1!";

        // Update user to this temp password securely and clear OTP
        await adminAuth.admin.updateUserById(user.id, {
            password: tempPassword,
            user_metadata: {
                ...metadata,
                pending_otp: null,
                otp_expiry: null,
            },
        });

        // Sign in to set cookie
        const supabase = await createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password: tempPassword,
        });

        if (signInError) {
            console.error("signInError:", signInError);
            return { success: false, error: "Failed to establish session." };
        }

        return { success: true };
    } catch (error: any) {
        console.error("Login verify error:", error);
        return { success: false, error: error?.message || "An unexpected error occurred." };
    }
}
