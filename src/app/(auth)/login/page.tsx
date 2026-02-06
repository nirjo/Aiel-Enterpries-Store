"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Button, Input } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In production, this would send OTP via Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-text-primary mb-2">
            Welcome back
          </h1>
          <p className="text-text-secondary">
            Sign in to your account to continue shopping
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            leftIcon={<Mail className="h-5 w-5" />}
            required
          />

          <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
            Continue with Email
            <ArrowRight className="h-5 w-5" />
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary-500 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-surface-300">
          <p className="text-xs text-text-muted text-center">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-text-primary">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
