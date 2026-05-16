import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Hr,
    Preview,
} from "@react-email/components";
import * as React from "react";

interface ContactFormEmailProps {
    name: string;
    email: string;
    subject: string;
    message: string;
    type: "acknowledgment" | "notification";
}

/**
 * Contact Form Email Template
 *
 * `type = "acknowledgment"` → sent to the user confirming their message was received.
 * `type = "notification"`   → sent to the business owner with the user's details.
 */
export default function ContactFormEmail({
    name = "Customer",
    email = "customer@example.com",
    subject = "General Enquiry",
    message = "Hello, I have a question.",
    type = "acknowledgment",
}: ContactFormEmailProps) {
    const isAcknowledgment = type === "acknowledgment";

    return (
        <Html>
            <Head />
            <Preview>
                {isAcknowledgment
                    ? `We've received your message — Aiel Enterprises`
                    : `New Contact Form Submission from ${name}`}
            </Preview>
            <Body
                style={{
                    backgroundColor: "#f6f9fc",
                    fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
            >
                <Container
                    style={{
                        backgroundColor: "#ffffff",
                        margin: "0 auto",
                        padding: "40px 20px",
                        maxWidth: "560px",
                        borderRadius: "8px",
                    }}
                >
                    {/* Header */}
                    <Section style={{ textAlign: "center" as const, marginBottom: "32px" }}>
                        <Text
                            style={{
                                fontSize: "24px",
                                fontWeight: "bold",
                                color: "#1a1a2e",
                                margin: "0 0 4px",
                            }}
                        >
                            Aiel Enterprises
                        </Text>
                        <Text
                            style={{
                                fontSize: "13px",
                                color: "#6b7280",
                                margin: "0",
                            }}
                        >
                            Your one-stop family store
                        </Text>
                    </Section>

                    {/* Icon */}
                    <Section style={{ textAlign: "center" as const, marginBottom: "24px" }}>
                        <Text style={{ fontSize: "48px", margin: "0" }}>
                            {isAcknowledgment ? "📬" : "📩"}
                        </Text>
                    </Section>

                    {/* Title */}
                    <Text
                        style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "#1a1a2e",
                            textAlign: "center" as const,
                            margin: "0 0 8px",
                        }}
                    >
                        {isAcknowledgment
                            ? `Hi ${name}, we got your message!`
                            : `New message from ${name}`}
                    </Text>
                    <Text
                        style={{
                            fontSize: "15px",
                            color: "#4b5563",
                            textAlign: "center" as const,
                            margin: "0 0 32px",
                        }}
                    >
                        {isAcknowledgment
                            ? "Thank you for reaching out. Our team will review your message and get back to you within 24 hours."
                            : `A new contact form submission has been received from ${email}.`}
                    </Text>

                    {/* Message Details Box */}
                    <Section
                        style={{
                            backgroundColor: "#f0f4ff",
                            borderRadius: "8px",
                            padding: "24px",
                            marginBottom: "24px",
                        }}
                    >
                        {/* Subject */}
                        <Text
                            style={{
                                fontSize: "11px",
                                color: "#6b7280",
                                margin: "0 0 4px",
                                textTransform: "uppercase" as const,
                                letterSpacing: "0.5px",
                                fontWeight: "600",
                            }}
                        >
                            Subject
                        </Text>
                        <Text
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: "#1a1a2e",
                                margin: "0 0 16px",
                            }}
                        >
                            {subject}
                        </Text>

                        {/* From (only in notification email) */}
                        {!isAcknowledgment && (
                            <>
                                <Text
                                    style={{
                                        fontSize: "11px",
                                        color: "#6b7280",
                                        margin: "0 0 4px",
                                        textTransform: "uppercase" as const,
                                        letterSpacing: "0.5px",
                                        fontWeight: "600",
                                    }}
                                >
                                    From
                                </Text>
                                <Text
                                    style={{
                                        fontSize: "14px",
                                        color: "#1a1a2e",
                                        margin: "0 0 16px",
                                    }}
                                >
                                    {name} ({email})
                                </Text>
                            </>
                        )}

                        {/* Message */}
                        <Text
                            style={{
                                fontSize: "11px",
                                color: "#6b7280",
                                margin: "0 0 4px",
                                textTransform: "uppercase" as const,
                                letterSpacing: "0.5px",
                                fontWeight: "600",
                            }}
                        >
                            Message
                        </Text>
                        <Text
                            style={{
                                fontSize: "14px",
                                color: "#374151",
                                margin: "0",
                                lineHeight: "1.6",
                                whiteSpace: "pre-wrap" as const,
                            }}
                        >
                            {message}
                        </Text>
                    </Section>

                    {/* Additional info for acknowledgment */}
                    {isAcknowledgment && (
                        <Section
                            style={{
                                backgroundColor: "#f9fafb",
                                borderRadius: "8px",
                                padding: "16px 24px",
                                marginBottom: "24px",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: "14px",
                                    color: "#374151",
                                    margin: "0",
                                }}
                            >
                                ⏰ Our team typically responds within <strong>24 hours</strong>.
                                If your matter is urgent, call us at{" "}
                                <strong>+91 9150234277</strong>.
                            </Text>
                        </Section>
                    )}

                    <Hr style={{ borderColor: "#e5e7eb", margin: "0 0 24px" }} />

                    {/* Footer */}
                    <Text
                        style={{
                            fontSize: "13px",
                            color: "#9ca3af",
                            textAlign: "center" as const,
                            margin: "0 0 4px",
                        }}
                    >
                        {isAcknowledgment
                            ? "We appreciate you contacting us! 💜"
                            : "Reply to this email to respond to the customer directly."}
                    </Text>
                    <Text
                        style={{
                            fontSize: "12px",
                            color: "#9ca3af",
                            textAlign: "center" as const,
                            margin: "0",
                        }}
                    >
                        Aiel Enterprises · No.4, 1st Cross Street, GT Nagar, Thattanchavady,
                        Puducherry-605009, India
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}
