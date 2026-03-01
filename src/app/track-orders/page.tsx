/**
 * Track Order Page — Server Component (app/track-order/page.tsx)
 *
 * This is a React Server Component (no "use client" directive).
 * It handles:
 *   - Static metadata for SEO
 *   - Page layout and structure
 *   - Rendering the hero banner and section headers (static content)
 *
 * Interactive parts are delegated to Client Components:
 *   - <TrackOrderForm />  → handles order tracking form + event handlers
 *   - <ContactSupportForm /> → handles contact buttons + message form
 *
 * This pattern keeps the page lightweight (zero JS for static parts)
 * while only shipping client-side JS for the interactive forms.
 */

import type { Metadata } from "next";
import { Package, Headphones } from "lucide-react";
import TrackOrderForm from "@/components/track-order/TrackOrderForm";
import ContactSupportForm from "@/components/track-order/ContactSupportForm";

export const metadata: Metadata = {
    title: "Track Order & Support",
    description:
        "Track your Aiel Enterprises order in real-time or get in touch with our support team.",
};

export default function TrackOrderPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* ── Hero Banner ── */}
            <section className="relative py-16 md:py-24 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 overflow-hidden">
                {/* Decorative blurred circles */}
                <div className="absolute inset-0 opacity-15">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-400 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                </div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 tracking-wide">
                        Track Your Order
                    </h1>
                    <p className="text-white/85 text-lg max-w-xl mx-auto">
                        Stay updated on your delivery status or reach out to our support team.
                    </p>
                </div>
            </section>

            {/* ── Main Content ── */}
            <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
                {/* ── Section 1: Track Order ── */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-sm">
                            <Package className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-text-primary tracking-wide">
                            Track Order
                        </h2>
                    </div>

                    {/* Track Order form — Client Component (needs onClick & useState) */}
                    <div className="tetradic-card rounded-2xl p-6 md:p-8 max-w-xl">
                        <TrackOrderForm />
                    </div>
                </section>

                {/* Divider */}
                <div className="relative mb-16">
                    <hr className="border-surface-200" />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f8fafc] px-4 text-text-muted text-sm font-medium">
                        or
                    </span>
                </div>

                {/* ── Section 2: Contact / Support ── */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-500 to-accent-500 flex items-center justify-center text-white shadow-sm">
                            <Headphones className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-display font-bold text-text-primary tracking-wide">
                                Need Help?
                            </h2>
                            <p className="text-text-muted text-sm">
                                Choose a contact method and we&apos;ll help you out.
                            </p>
                        </div>
                    </div>

                    {/* Contact Support — Client Component (needs onClick & useState) */}
                    <ContactSupportForm />
                </section>
            </div>
        </div>
    );
}
