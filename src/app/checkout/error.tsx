"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

export default function CheckoutError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Checkout error:", error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="h-10 w-10 text-amber-500" />
                </div>

                <h1 className="text-2xl font-display font-bold text-text-primary mb-3">
                    Something went wrong
                </h1>

                <p className="text-text-secondary mb-8">
                    We encountered an error while loading the checkout page. Please try
                    again or return to your cart.
                </p>

                <div className="space-y-3">
                    <Button onClick={reset} fullWidth size="lg">
                        <RefreshCw className="h-5 w-5" />
                        Try Again
                    </Button>
                    <Link href="/cart">
                        <Button variant="outline" fullWidth size="lg">
                            <ArrowLeft className="h-5 w-5" />
                            Return to Cart
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
