"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Package, Clock, Truck, Home } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const TRACKING_STEPS = [
    { id: "placed", label: "Order Placed", icon: Clock },
    { id: "processing", label: "Processing", icon: Package },
    { id: "shipped", label: "Shipped", icon: Truck },
    { id: "out_for_delivery", label: "Out for Delivery", icon: Truck }, // Using Truck or Bike
    { id: "delivered", label: "Delivered", icon: Home },
];

// Helper to map DB status to timeline index
export function getStepIndex(status: string): number {
    const s = status.toLowerCase();
    if (s.includes("deliver")) return 4;
    if (s.includes("out")) return 3;
    if (s.includes("ship")) return 2;
    if (s.includes("process")) return 1;
    return 0; // default to placed/pending
}

interface TrackingTimelineProps {
    currentStatus: string;
    language?: "en" | "ta" | "hi";
}

const translations = {
    en: ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"],
    ta: ["ஆர்டர் செய்யப்பட்டது", "செயலாக்கத்தில்", "அனுப்பப்பட்டது", "விநியோகத்திற்கு தயாராக உள்ளது", "வழங்கப்பட்டது"],
    hi: ["ऑर्डर दिया गया", "प्रोसेसिंग", "भेज दिया गया", "डिलीवरी के लिए तैयार", "वितरित"],
};

export default function TrackingTimeline({ currentStatus, language = "en" }: TrackingTimelineProps) {
    const activeIndex = getStepIndex(currentStatus);
    const labels = translations[language] || translations.en;

    return (
        <div className="py-6 px-4 md:px-8 bg-white/60 backdrop-blur-md rounded-2xl border border-surface-200tetradic-card">
            <h3 className="text-lg font-bold text-text-primary mb-6 font-display">Tracking Status</h3>
            <div className="relative">
                {/* Vertical Line */ }
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-surface-200">
                    <motion.div 
                        className="absolute top-0 w-full bg-gradient-to-b from-primary-400 to-secondary-500 rounded-full"
                        initial={{ height: 0 }}
                        animate={{ height: `${(activeIndex / (TRACKING_STEPS.length - 1)) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>

                <div className="space-y-8 relative">
                    {TRACKING_STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index < activeIndex;
                        const isActive = index === activeIndex;

                        return (
                            <motion.div 
                                key={step.id} 
                                className="flex items-start gap-4"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.15 }}
                            >
                                {/* Step Indicator */}
                                <div className={cn(
                                    "relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 shadow-sm transition-all duration-300",
                                    isCompleted ? "bg-emerald-500 border-emerald-100 text-white" : 
                                    isActive ? "bg-white border-primary-400 text-primary-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]" : 
                                    "bg-surface-100 border-white text-text-muted"
                                )}>
                                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    
                                    {/* Pulsing dot for active state */}
                                    {isActive && (
                                        <span className="absolute -inset-1.5 rounded-full border border-primary-400 animate-ping opacity-75" />
                                    )}
                                </div>

                                {/* Step Content */}
                                <div className="pt-2 flex-1">
                                    <h4 className={cn(
                                        "font-bold text-base transition-colors",
                                        isActive ? "text-primary-600" : isCompleted ? "text-text-primary" : "text-text-muted"
                                    )}>
                                        {labels[index]}
                                    </h4>
                                    
                                    {isActive && (
                                        <motion.p 
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="text-sm text-text-secondary mt-1"
                                        >
                                            Your package is currently in this stage.
                                        </motion.p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
