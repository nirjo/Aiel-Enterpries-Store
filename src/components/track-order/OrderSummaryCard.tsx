"use client";

import React from "react";
import { PackageOpen, Calendar, IndianRupee, MapPin } from "lucide-react";
import { format } from "date-fns";

interface TrackingDetails {
    location?: string;
    eta?: string;
    [key: string]: any;
}

interface OrderSummaryProps {
    order: {
        order_number: string;
        created_at: string;
        total: number;
        status: string;
        tracking_details?: TrackingDetails;
    };
}

export default function OrderSummaryCard({ order }: OrderSummaryProps) {
    const { order_number, created_at, total, status, tracking_details } = order;
    const dateStr = created_at ? format(new Date(created_at), "MMM dd, yyyy") : "N/A";

    return (
        <div className="bg-gradient-to-br from-primary-900 to-secondary-900 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
            {/* Decals */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary-400/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary-400/20 rounded-full blur-xl" />
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-secondary-200 text-xs uppercase tracking-wider font-semibold mb-1">Order Summary</p>
                        <h2 className="text-2xl font-display font-bold font-mono text-white tracking-widest">{order_number}</h2>
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                        <span className="text-xs font-semibold capitalize text-secondary-100">{status}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-primary-300" />
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-400 uppercase">Placed On</p>
                            <p className="text-sm font-semibold text-white/90">{dateStr}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <IndianRupee className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-400 uppercase">Total Value</p>
                            <p className="text-sm font-semibold text-white/90">₹{total?.toFixed(2) || "0.00"}</p>
                        </div>
                    </div>
                    
                    {tracking_details?.eta && (
                         <div className="flex items-center gap-3 col-span-2 mt-2">
                             <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                 <PackageOpen className="w-4 h-4 text-accent-300" />
                             </div>
                             <div>
                                 <p className="text-[10px] text-zinc-400 uppercase">Est. Delivery / ETA</p>
                                 <p className="text-sm font-semibold text-white/90">{tracking_details.eta}</p>
                             </div>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
}
