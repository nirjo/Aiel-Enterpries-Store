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

interface OrderConfirmationEmailProps {
    customerName: string;
    orderNumber: string;
    total: number;
    orderId: string;
    appUrl: string;
}

export default function OrderConfirmationEmail({
    customerName = "Customer",
    orderNumber = "ORD-2026-00001",
    total = 799,
    orderId = "",
    appUrl = "https://aiel-enterprises-store.vercel.app",
}: OrderConfirmationEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>
                Order {orderNumber} confirmed — Aiel Enterprises
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

                    {/* Success Icon */}
                    <Section style={{ textAlign: "center" as const, marginBottom: "24px" }}>
                        <Text
                            style={{
                                fontSize: "48px",
                                margin: "0",
                            }}
                        >
                            ✅
                        </Text>
                    </Section>

                    {/* Greeting */}
                    <Text
                        style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "#1a1a2e",
                            textAlign: "center" as const,
                            margin: "0 0 8px",
                        }}
                    >
                        Thank you, {customerName}!
                    </Text>
                    <Text
                        style={{
                            fontSize: "15px",
                            color: "#4b5563",
                            textAlign: "center" as const,
                            margin: "0 0 32px",
                        }}
                    >
                        Your order has been confirmed and is being processed.
                    </Text>

                    {/* Order Details Box */}
                    <Section
                        style={{
                            backgroundColor: "#f0f4ff",
                            borderRadius: "8px",
                            padding: "24px",
                            marginBottom: "24px",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: "13px",
                                color: "#6b7280",
                                margin: "0 0 4px",
                                textTransform: "uppercase" as const,
                                letterSpacing: "0.5px",
                            }}
                        >
                            Order Number
                        </Text>
                        <Text
                            style={{
                                fontSize: "22px",
                                fontWeight: "bold",
                                color: "#1a1a2e",
                                margin: "0 0 16px",
                                fontFamily: "monospace",
                            }}
                        >
                            {orderNumber}
                        </Text>
                        <Text
                            style={{
                                fontSize: "13px",
                                color: "#6b7280",
                                margin: "0 0 4px",
                                textTransform: "uppercase" as const,
                                letterSpacing: "0.5px",
                            }}
                        >
                            Total Amount
                        </Text>
                        <Text
                            style={{
                                fontSize: "22px",
                                fontWeight: "bold",
                                color: "#059669",
                                margin: "0",
                            }}
                        >
                            ₹{total.toLocaleString("en-IN")}
                        </Text>
                    </Section>

                    {/* Delivery Info */}
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
                            📦 Estimated delivery: <strong>3–5 business days</strong>
                        </Text>
                    </Section>

                    {/* CTA Button */}
                    <Section style={{ textAlign: "center" as const, marginBottom: "32px" }}>
                        <a
                            href={`${appUrl}/order/${orderId}`}
                            style={{
                                display: "inline-block",
                                backgroundColor: "#4f46e5",
                                color: "#ffffff",
                                fontSize: "15px",
                                fontWeight: "600",
                                padding: "12px 32px",
                                borderRadius: "8px",
                                textDecoration: "none",
                            }}
                        >
                            View Order Details →
                        </a>
                    </Section>

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
                        Welcome back anytime! 🛒
                    </Text>
                    <Text
                        style={{
                            fontSize: "12px",
                            color: "#9ca3af",
                            textAlign: "center" as const,
                            margin: "0",
                        }}
                    >
                        Aiel Enterprises · Puducherry, India
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}
