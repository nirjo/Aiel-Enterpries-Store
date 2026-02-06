"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In production, verify OTP with Supabase
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
          <KeyRound className="h-8 w-8 text-primary-500" />
        </div>
        <h1 className="text-2xl font-display font-bold text-text-primary mb-2">
          Enter verification code
        </h1>
        <p className="text-text-secondary">
          We&apos;ve sent a 6-digit code to{" "}
          <span className="font-medium text-text-primary">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-semibold rounded-xl border border-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-all"
            />
          ))}
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
          disabled={otp.some((d) => !d)}
        >
          Verify & Sign In
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-text-muted">
          Didn&apos;t receive the code?{" "}
          <button className="text-primary-500 font-medium hover:underline">
            Resend
          </button>
        </p>
      </div>
    </>
  );
}

function VerifyFormFallback() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
        <KeyRound className="h-8 w-8 text-primary-500" />
      </div>
      <h1 className="text-2xl font-display font-bold text-text-primary mb-2">
        Loading...
      </h1>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <Suspense fallback={<VerifyFormFallback />}>
          <VerifyForm />
        </Suspense>
      </div>
    </div>
  );
}
