"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { sendEmailOTP, verifyOTPAndSignup, verifyOTPAndLogin } from "@/app/actions/auth-email";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Loader2, Mail, Lock, User, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type FlowState = "EMAIL" | "LOGIN_OTP" | "SIGNUP_DETAILS";

function EmailLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Form State
  const initialFlow = (searchParams.get("flow") as FlowState) || "EMAIL";
  const [flowState, setFlowState] = useState<FlowState>(initialFlow);
  const [isLoading, setIsLoading] = useState(false);
  
  // Data State
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [name, setName] = useState(searchParams.get("name") || "");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendEmailOTP(email);
      if (res.success) {
        toast.success("Verification code sent to your email!");
        setFlowState(res.isNewUser ? "SIGNUP_DETAILS" : "LOGIN_OTP");
      } else {
        toast.error(res.error || "Failed to send email");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyOTPAndLogin(email, otp);
      if (res.success) {
        toast.success("Successfully logged in!");
        router.push("/account");
        router.refresh();
      } else {
        toast.error(res.error || "Invalid code");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !password || !otp) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyOTPAndSignup(email, name, password, otp);
      if (res.success) {
        toast.success("Account created successfully!");
        router.push("/account");
        router.refresh();
      } else {
        toast.error(res.error || "Invalid code or setup failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-pink-100">
        <div className="flex flex-col items-center">
          <BrandLogo />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {flowState === "EMAIL" && "Welcome to Aiel"}
            {flowState === "LOGIN_OTP" && "Welcome Back"}
            {flowState === "SIGNUP_DETAILS" && "Complete Sign Up"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {flowState === "EMAIL" && "Sign in or create an account with your email"}
            {flowState === "LOGIN_OTP" && `Enter the code sent to ${email}`}
            {flowState === "SIGNUP_DETAILS" && "Set up your profile to continue"}
          </p>
        </div>

        {flowState === "EMAIL" && (
          <form className="mt-8 space-y-6" onSubmit={handleSendEmail}>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 flex justify-center py-2 px-4 bg-pink-500 hover:bg-pink-600 focus:ring-pink-500 text-lg transition-all shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Continue with Email
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
            
            <div className="text-center mt-4">
               <Link href="/auth/login" className="text-sm font-medium text-pink-600 hover:text-pink-500 flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back to other login options
               </Link>
            </div>
          </form>
        )}

        {flowState === "LOGIN_OTP" && (
          <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                6-Digit Login Code
              </label>
              <Input
                id="otp"
                name="otp"
                type="text"
                autoComplete="one-time-code"
                required
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="text-center text-2xl tracking-widest h-14"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-pink-500 hover:bg-pink-600 focus:ring-pink-500"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Log In"}
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setFlowState("EMAIL")}
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Use a different email
              </button>
            </div>
          </form>
        )}

        {flowState === "SIGNUP_DETAILS" && (
          <form className="mt-8 space-y-5" onSubmit={handleSignupSubmit}>
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Set Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Set Password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="otpSignup" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <Input
                id="otpSignup"
                name="otp"
                type="text"
                autoComplete="one-time-code"
                required
                maxLength={6}
                placeholder="Enter 6-digit code from email"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="tracking-widest font-mono font-bold text-center pl-2"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-2 bg-pink-500 hover:bg-pink-600 focus:ring-pink-500"
              disabled={isLoading || otp.length !== 6 || password.length < 6 || !name.trim()}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Complete Registration"}
            </Button>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setFlowState("EMAIL")}
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Start over
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function EmailLoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
    </div>
  );
}

// Export wrapped in Suspense for Next.js 15 compatibility
export default function EmailLoginPage() {
  return (
    <Suspense fallback={<EmailLoginLoading />}>
      <EmailLoginForm />
    </Suspense>
  );
}
