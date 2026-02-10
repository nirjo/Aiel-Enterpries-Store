"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, KeyRound, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { verifyOtp, signInWithEmail } from "@/lib/auth";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

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

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      const lastInput = document.getElementById("otp-5");
      lastInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = otp.join("");
      await verifyOtp(email, token);
      router.push("/account");
    } catch (err) {
      console.error("Verification error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Invalid verification code. Please try again."
      );
      // Clear OTP fields on error
      setOtp(["", "", "", "", "", ""]);
      const firstInput = document.getElementById("otp-0");
      firstInput?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !email) return;
    setIsResending(true);
    setError(null);
    setResendSuccess(false);

    try {
      await signInWithEmail(email);
      setResendSuccess(true);
      setResendCooldown(60);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      console.error("Resend error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to resend code. Please try again."
      );
    } finally {
      setIsResending(false);
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

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm text-center">
          {error}
        </div>
      )}

      {/* Resend Success */}
      {resendSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center flex items-center justify-center gap-2">
          <CheckCircle className="h-4 w-4" />
          New code sent to your email
        </div>
      )}

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
              onPaste={index === 0 ? handlePaste : undefined}
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
          <button
            onClick={handleResendCode}
            disabled={resendCooldown > 0 || isResending}
            className="text-primary-500 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending
              ? "Sending..."
              : resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend"}
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

