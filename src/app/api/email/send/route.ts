import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";
import OtpEmail from "@/emails/otp-email";
import WelcomeEmail from "@/emails/welcome-email";
import { createElement } from "react";

// Map template names to React Email components
const templates: Record<string, (props: Record<string, unknown>) => React.ReactElement> = {
    otp: (props) => createElement(OtpEmail, props as { otp: string; email?: string }),
    welcome: (props) =>
        createElement(WelcomeEmail, props as { name?: string; appUrl?: string }),
};

export async function POST(request: NextRequest) {
    try {
        // Validate API key is configured
        if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "your_resend_api_key") {
            return NextResponse.json(
                { error: "Resend API key is not configured. Set RESEND_API_KEY in .env.local" },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { to, subject, template, data, html } = body;

        if (!to || !subject) {
            return NextResponse.json(
                { error: "Missing required fields: 'to' and 'subject'" },
                { status: 400 }
            );
        }

        // Build email options
        let react: React.ReactElement | undefined;

        if (template && templates[template]) {
            react = templates[template](data || {});
        }

        const result = await sendEmail({
            to,
            subject,
            react,
            html: !react ? html : undefined,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Email send API error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to send email" },
            { status: 500 }
        );
    }
}
