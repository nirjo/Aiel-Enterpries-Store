import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailOptions {
    to: string | string[];
    subject: string;
    react?: React.ReactElement;
    html?: string;
    text?: string;
    from?: string;
    replyTo?: string;
}

/**
 * Send an email via Resend API
 * Use this for custom transactional emails (order confirmations, etc.)
 * For auth emails (OTP, magic links), Supabase handles sending via SMTP config.
 */
export async function sendEmail({
    to,
    subject,
    react,
    html,
    text,
    from,
    replyTo,
}: SendEmailOptions) {
    const defaultFrom =
        process.env.RESEND_FROM_EMAIL || "Aiel Enterprises <onboarding@resend.dev>";

    try {
        const { data, error } = await resend.emails.send({
            from: from || defaultFrom,
            to: Array.isArray(to) ? to : [to],
            subject,
            react: react ?? undefined,
            html: html ?? undefined,
            text: text ?? undefined,
            replyTo: replyTo ?? undefined,
        });

        if (error) {
            console.error("Resend email error:", error);
            throw new Error(error.message);
        }

        return { success: true, id: data?.id };
    } catch (err) {
        console.error("Failed to send email:", err);
        throw err;
    }
}

export { resend };
