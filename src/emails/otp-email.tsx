import {
  Body,
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

interface OtpEmailProps {
  otp: string;
  email?: string;
}

export default function OtpEmail({ otp = "123456", email }: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Aiel Enterprises verification code: {otp}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>Aiel Enterprises</Heading>
          </Section>

          <Section style={content}>
            <Heading style={heading}>Verification Code</Heading>
            <Text style={paragraph}>
              {email
                ? `Enter this code to sign in to your account (${email}):`
                : "Enter this code to sign in to your account:"}
            </Text>

            {/* OTP Code Display */}
            <Section style={codeContainer}>
              <Text style={code}>{otp}</Text>
            </Section>

            <Text style={paragraph}>
              This code expires in <strong>10 minutes</strong>. If you
              didn&apos;t request this code, you can safely ignore this email.
            </Text>

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

const codeContainer: React.CSSProperties = {
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  borderRadius: "12px",
  margin: "24px 0",
  padding: "20px",
  textAlign: "center" as const,
};

const code: React.CSSProperties = {
  fontSize: "36px",
  fontWeight: 700,
  letterSpacing: "8px",
  color: "#ffffff",
  margin: 0,
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
