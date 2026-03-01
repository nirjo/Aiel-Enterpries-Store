"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Send, Bell, Languages } from "lucide-react";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

// Map must be dynamically imported because it relies on the global 'window'
const DeliveryMap = dynamic(() => import("./DeliveryMap"), { ssr: false });
import TrackingTimeline from "./TrackingTimeline";
import OrderSummaryCard from "./OrderSummaryCard";

interface TrackingDashboardProps {
    orderNumber: string;
    customerEmail: string;
    initialOrderData: any; // Fetched from the API
}

export default function TrackingDashboard({ orderNumber, customerEmail, initialOrderData }: TrackingDashboardProps) {
    const [order, setOrder] = useState(initialOrderData);
    const [language, setLanguage] = useState<"en" | "ta" | "hi">("en");
    const [sendingUpdates, setSendingUpdates] = useState(false);
    const [updateResult, setUpdateResult] = useState<{ type: "success" | "error", message: string } | null>(null);

    const supabase = createClient();

    // 1. Setup Supabase Realtime Subscription
    useEffect(() => {
        if (!order?.id) return;

        console.log("Subscribing to realtime updates for order:", order.id);
        const channel = supabase
            .channel(`order-updates-${order.id}`)
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${order.id}` },
                (payload) => {
                    console.log("Realtime order update received:", payload);
                    setOrder((prev: any) => ({ ...prev, ...payload.new }));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [order?.id, supabase]);

    // 2. Handle Resend Notification Request
    const handleResendUpdates = async () => {
        setSendingUpdates(true);
        setUpdateResult(null);

        try {
            const res = await fetch("/api/notifications/send-tracking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order: order.order_number,
                    customerEmail: order.customer_email,
                    phone: order.phone,
                    status: order.status,
                    eta: order.tracking_details?.eta,
                }),
            });

            if (res.ok) {
                setUpdateResult({ type: "success", message: "Updates successfully dispatched!" });
            } else {
                setUpdateResult({ type: "error", message: "Failed to send updates. Please try again." });
            }
        } catch (error) {
            setUpdateResult({ type: "error", message: "An unexpected error occurred." });
        } finally {
            setSendingUpdates(false);
            setTimeout(() => setUpdateResult(null), 5000); // Clear after 5 seconds
        }
    };

    // Calculate simulated progress based on status
    const getProgress = useCallback(() => {
        const s = order.status?.toLowerCase() || "";
        if (s.includes("place") || s.includes("pending")) return 0;
        if (s.includes("process")) return 20;
        if (s.includes("ship")) return 50;
        if (s.includes("out")) return 80;
        if (s.includes("deliver")) return 100;
        return 10;
    }, [order.status]);

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-surface-200 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">Tracking Dashboard</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" /> Live
                    </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Language Toggle */}
                    <div className="flex items-center gap-1 bg-surface-100 rounded-lg p-1 border border-surface-200">
                        <Languages className="w-4 h-4 ml-2 text-text-muted" />
                        <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className="bg-transparent text-sm border-none focus:ring-0 text-text-primary outline-none py-1.5 px-2 cursor-pointer"
                        >
                            <option value="en">English</option>
                            <option value="ta">தமிழ்</option>
                            <option value="hi">हिंदी</option>
                        </select>
                    </div>

                    {/* Resend Updates Button */}
                    <Button 
                        variant="primary" 
                        size="sm" 
                        isLoading={sendingUpdates} 
                        onClick={handleResendUpdates}
                        className="bg-gradient-to-r from-secondary-500 to-accent-500 hover:from-secondary-600 hover:to-accent-600 shadow-sm ml-auto sm:ml-0"
                    >
                        <Bell className="w-4 h-4 mr-1.5" />
                        Send Updates
                    </Button>
                </div>
            </div>

            {/* Notification Feedback */}
            {updateResult && (
                <div className={`p-3 rounded-lg text-sm border ${updateResult.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'} flex items-center gap-2 mb-4`}>
                    {updateResult.type === 'success' ? <Send className="w-4 h-4" /> : <span className="font-bold">!</span>}
                    {updateResult.message}
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column (Timeline & Summary) */}
                <div className="col-span-1 space-y-6">
                    <OrderSummaryCard order={order} />
                    <TrackingTimeline currentStatus={order.status} language={language} />
                </div>

                {/* Right Column (Map) */}
                <div className="col-span-1 lg:col-span-2">
                    <div className="bg-white rounded-2xl p-4 md:p-6 border border-surface-200 shadow-sm tetradic-card h-full flex flex-col">
                        <h3 className="text-lg font-bold text-text-primary mb-4 font-display flex items-center justify-between">
                            Live Delivery Map
                            {order.tracking_details?.eta && (
                                <span className="text-sm font-medium bg-primary-50 text-primary-700 px-3 py-1 rounded-full border border-primary-100">
                                    ETA: {order.tracking_details.eta}
                                </span>
                            )}
                        </h3>
                        
                        <div className="flex-1 min-h-[400px]">
                            {/* Map needs to be highly available with bounds ensuring visibility */}
                            <DeliveryMap 
                                status={order.status} 
                                coordinates={order.tracking_details?.destination || [11.95, 79.82]} // Default puducherry offset
                                progress={getProgress()} 
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
