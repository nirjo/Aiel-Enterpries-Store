"use client";

import { useState, type FormEvent } from "react";
import { Search, Package, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";
import TrackingDashboard from "./TrackingDashboard";

type TrackStatus = "idle" | "loading" | "success" | "error";

export default function TrackOrderForm() {
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<TrackStatus>("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [orderData, setOrderData] = useState<any>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!orderId.trim() || !email.trim()) {
            setErrorMessage("Please enter both your Order ID and email address.");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        try {
            const res = await fetch("/api/track-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: orderId.trim(), email: email.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMessage(data.error || "Order not found. Please check your details.");
                setStatus("error");
                return;
            }

            setOrderData(data.order);
            setStatus("success");
            
        } catch (error) {
            setErrorMessage("Failed to connect to tracking service. Please try again.");
            setStatus("error");
        }
    };

    const handleReset = () => {
        setOrderId("");
        setEmail("");
        setOrderData(null);
        setStatus("idle");
    };

    // ── Success state (Dashboard) ──
    if (status === "success" && orderData) {
        return (
            <div className="animate-fadeIn w-full relative">
                <button 
                    onClick={handleReset}
                    className="absolute -top-12 left-0 flex items-center text-sm font-medium text-text-muted hover:text-primary-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Search
                </button>
                <TrackingDashboard 
                    orderNumber={orderData.order_number} 
                    customerEmail={orderData.customer_email} 
                    initialOrderData={orderData} 
                />
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
                    {errorMessage}
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
