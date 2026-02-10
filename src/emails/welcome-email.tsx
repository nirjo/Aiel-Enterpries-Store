import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  name?: string;
  appUrl?: string;
}

export default function WelcomeEmail({
  name = "there",
  appUrl = "http://localhost:3000",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Aiel Enterprises — let&apos;s get started!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>Aiel Enterprises</Heading>
          </Section>

          <Section style={content}>
            <Heading style={heading}>Welcome, {name}! 🎉</Heading>
            <Text style={paragraph}>
              Thank you for joining Aiel Enterprises. We&apos;re excited to have
              you on board!
            </Text>
            <Text style={paragraph}>
              Explore our curated collection of premium products and discover
              amazing deals crafted just for you.
            </Text>

            <Section style={ctaContainer}>
              <Button style={ctaButton} href={`${appUrl}/products`}>
                Start Shopping →
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              &copy; {new Date().getFullYear()} Aiel Enterprises. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container: React.CSSProperties = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const header: React.CSSProperties = {
  padding: "24px 32px",
};

const logo: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 700,
  color: "#6366f1",
  textAlign: "center" as const,
  margin: 0,
};

const content: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "32px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
};

const heading: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 600,
  color: "#1a1a2e",
  textAlign: "center" as const,
  margin: "0 0 16px",
};

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#4a5568",
  textAlign: "center" as const,
};

const ctaContainer: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const ctaButton: React.CSSProperties = {
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 600,
  textDecoration: "none",
  padding: "14px 32px",
  display: "inline-block",
};

const hr: React.CSSProperties = {
  borderColor: "#e8e8e8",
  margin: "24px 0",
};

const footer: React.CSSProperties = {
  fontSize: "12px",
  lineHeight: "20px",
  color: "#9ca3af",
  textAlign: "center" as const,
};
