import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";
import ContactFormEmail from "@/emails/contact-form-email";
import { createElement } from "react";

export async function POST(request: NextRequest) {
    try {
        // Validate Resend API key
        if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "your_resend_api_key") {
            return NextResponse.json(
                { error: "Email service is not configured." },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: "All fields are required: name, email, subject, message." },
                { status: 400 }
            );
        }

        // Basic email format check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        // 1. Send acknowledgment email to the user
        await sendEmail({
            to: email,
            subject: `We received your message — "${subject}"`,
            react: createElement(ContactFormEmail, {
                name,
                email,
                subject,
                message,
                type: "acknowledgment",
            }),
            replyTo: "support@aielenterprises.com",
        });

        // 2. Send notification email to the business
        await sendEmail({
            to: "support@aielenterprises.com",
            subject: `[Contact Form] ${subject} — from ${name}`,
            react: createElement(ContactFormEmail, {
                name,
                email,
                subject,
                message,
                type: "notification",
            }),
            replyTo: email,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact form API error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to send message. Please try again." },
            { status: 500 }
        );
    }
}
