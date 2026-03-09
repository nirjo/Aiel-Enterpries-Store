import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface AuthEmailProps {
  otp: string;
  isNewUser: boolean;
}

export const AuthEmail = ({ otp, isNewUser }: AuthEmailProps) => {
  const previewText = isNewUser
    ? "Welcome to Aiel Enterprises! Here's your sign up code"
    : "Your Aiel Enterprises login code";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              {/* Optional: Replace with your actual logo URL when deployed */}
              {/* <Img
                src={`https://yourdomain.com/logo.png`}
                width="120"
                height="40"
                alt="Aiel Enterprises"
                className="my-0 mx-auto"
              /> */}
              <Text className="text-center font-bold text-2xl text-[#EC4899] mb-4">
                Aiel Enterprises <span className="text-[#3B82F6]">Toys</span>
              </Text>
            </Section>
            
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              {isNewUser ? "Welcome to the Toy Paradise!" : "Welcome back!"}
            </Heading>
            
            <Text className="text-black text-[14px] leading-[24px]">
              {isNewUser
                ? "We're excited to have you join us. Please use the following One-Time Password (OTP) to complete your sign-up process:"
                : "Ahoy there! Please use the following One-Time Password (OTP) to securely log in to your account:"}
            </Text>

            <Section className="bg-[#f0fdfa] rounded-lg my-[32px] mx-0 py-[20px] text-center border-2 border-dashed border-[#10b981]">
              <Text className="text-[32px] font-bold tracking-[0.3em] text-[#0f766e] m-0">
                {otp}
              </Text>
            </Section>
            
            <Text className="text-black text-[14px] leading-[24px]">
              This code will expire in 10 minutes. If you did not request this email, you can safely ignore it.
            </Text>
            <Text className="text-[#666666] text-[12px] leading-[24px] mt-[32px]">
              This email was intended for you. If you were not expecting this login code, you can ignore this email.
            </Text>
            <Text className="text-[#EC4899] text-[12px] leading-[24px] italic text-center">
              "Bringing joy through robots, toys, and green circuits!"
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AuthEmail;
