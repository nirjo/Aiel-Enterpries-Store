"use client";

/**
 * TrackOrderForm — Client Component
 *
 * WHY "use client"?
 *   This component uses useState for form state and onClick / onSubmit
 *   event handlers, which are only available in Client Components.
 *   Server Components cannot attach event listeners.
 *
 * HOW STATE IS MANAGED:
 *   - `orderId` and `email` are controlled inputs via useState.
 *   - `status` tracks "idle" | "success" | "error" to show feedback.
 *   - On submit we log to console (no real API) and show a result message.
 */

import { useState, type FormEvent } from "react";
import { Search, Package, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui";

type TrackStatus = "idle" | "loading" | "success" | "error";

export default function TrackOrderForm() {
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<TrackStatus>("idle");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!orderId.trim() || !email.trim()) {
            setStatus("error");
            return;
        }

        setStatus("loading");

        // Simulate an API call — log to console (frontend-only prototype)
        console.log("🔍 Track Order submitted:", { orderId: orderId.trim(), email: email.trim() });

        // Simulate network delay then show success
        setTimeout(() => {
            setStatus("success");
        }, 1200);
    };

    const handleReset = () => {
        setOrderId("");
        setEmail("");
        setStatus("idle");
    };

    // ── Success state ──
    if (status === "success") {
        return (
            <div className="text-center py-8 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Order Found!</h3>
                <p className="text-text-secondary mb-1">
                    Order <span className="font-mono font-semibold text-primary-500">{orderId}</span>
                </p>
                <p className="text-text-muted text-sm mb-6">
                    We&apos;ve sent tracking details to <strong>{email}</strong>
                </p>

                {/* Simulated order timeline */}
                <div className="max-w-sm mx-auto text-left mb-8">
                    <div className="space-y-4">
                        {[
                            { label: "Order Placed", done: true },
                            { label: "Payment Confirmed", done: true },
                            { label: "Processing", done: true },
                            { label: "Shipped", done: false },
                            { label: "Delivered", done: false },
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                        step.done
                                            ? "bg-emerald-500 text-white"
                                            : "bg-surface-200 text-text-muted"
                                    }`}
                                >
                                    {step.done ? "✓" : i + 1}
                                </div>
                                <span
                                    className={`text-sm font-medium ${
                                        step.done ? "text-text-primary" : "text-text-muted"
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <Button onClick={handleReset} variant="outline" size="lg">
                    Track Another Order
                </Button>
            </div>
        );
    }

    // ── Form state ──
    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center border border-primary-200/50">
                    <Package className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                    <h3 className="font-semibold text-text-primary">Track Your Package</h3>
                    <p className="text-text-muted text-sm">Enter your order ID and email to get real-time updates</p>
                </div>
            </div>

            {/* Error feedback */}
            {status === "error" && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-fadeIn">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    Please enter both your Order ID and email address.
                </div>
            )}

            <div>
                <label htmlFor="track-order-id" className="block text-sm font-medium text-text-primary mb-1.5">
                    Order ID
                </label>
                <input
                    id="track-order-id"
                    type="text"
                    value={orderId}
                    onChange={(e) => { setOrderId(e.target.value); setStatus("idle"); }}
                    placeholder="e.g. ORD-2026-A1B2C"
                    className="w-full h-11 px-4 rounded-xl border border-surface-300 bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15 transition-colors font-mono"
                />
            </div>

            <div>
                <label htmlFor="track-email" className="block text-sm font-medium text-text-primary mb-1.5">
                    Email Address
                </label>
                <input
                    id="track-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                    placeholder="you@example.com"
                    className="w-full h-11 px-4 rounded-xl border border-surface-300 bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15 transition-colors"
                />
            </div>

            <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={status === "loading"}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg"
            >
                <Search className="h-4 w-4" />
                Track Order
            </Button>
        </form>
    );
}
