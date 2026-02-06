"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/components/providers";

// Google logo SVG component
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// Loading fallback for Suspense
function LoginLoading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
    </div>
  );
}

// Main login form component that uses useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const redirect = searchParams.get("redirect") || "/account";
  const error = searchParams.get("error");

  const handleEmailSubmit = async (e: React.FormEvent) => {
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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle(redirect);
    } catch (error) {
      console.error("Google sign in error:", error);
      setIsGoogleLoading(false);
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
            {decodeURIComponent(error)}
          </div>
        )}

        {/* Google Sign In Button */}
        <Button
          onClick={handleGoogleSignIn}
          isLoading={isGoogleLoading}
          size="lg"
          variant="outline"
          fullWidth
          className="relative bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-medium mb-6"
        >
          {!isGoogleLoading && <GoogleLogo className="h-5 w-5 mr-3" />}
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-surface-300" />
          <span className="text-sm text-text-muted">or</span>
          <div className="flex-1 h-px bg-surface-300" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-6">
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

// Export wrapped in Suspense for Next.js 15 compatibility
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
