"use client";

/**
 * ContactSupportForm — Client Component
 *
 * WHY "use client"?
 *   This component needs useState for form state management, onClick handlers
 *   for the contact method buttons, and onSubmit for the contact form.
 *   None of these are available in Server Components.
 *
 * HOW STATE IS MANAGED:
 *   - `activeMethod` tracks which contact button was clicked (or null).
 *   - `formData` holds name/email/subject/message as controlled inputs.
 *   - `status` tracks "idle" | "loading" | "success" for form submission.
 *   - Clicking any contact button sets `activeMethod` and scrolls down
 *     to the "Send Us a Message" form, pre-filling the subject line.
 *
 * HOW BUTTON CLICKS TRIGGER THE FORM:
 *   Each contact card has an onClick that calls `handleMethodClick(method)`.
 *   This sets the active method, auto-fills the subject field, and scrolls
 *   the form into view using a ref.
 */

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle, Headphones } from "lucide-react";
import { Button } from "@/components/ui";

// Contact method definitions
const contactMethods = [
    {
        id: "contact",
        icon: Headphones,
        title: "Contact Us",
        detail: "General enquiry",
        sub: "We're happy to help",
        subject: "General Enquiry",
    },
    {
        id: "email",
        icon: Mail,
        title: "Email Us",
        detail: "support.help@gmail.com",
        sub: "We reply within 24 hours",
        subject: "Email Support Request",
    },
    {
        id: "call",
        icon: Phone,
        title: "Call Us",
        detail: "+91 9150816348",
        sub: "Mon–Sat, 10 AM – 7 PM IST",
        subject: "Phone Support Request",
    },
    {
        id: "visit",
        icon: MapPin,
        title: "Visit Us",
        detail: "No 4, 3rd Cross, GT Nagar",
        sub: "Thattanchavady, Puducherry - 605009, India",
        subject: "Store Visit Enquiry",
    },
    {
        id: "message",
        icon: MessageSquare,
        title: "Send Us a Message",
        detail: "Quick contact form",
        sub: "Fill out the form below",
        subject: "Quick Message",
    },
];

type FormStatus = "idle" | "loading" | "success";

export default function ContactSupportForm() {
    const [activeMethod, setActiveMethod] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState<FormStatus>("idle");
    const formRef = useRef<HTMLDivElement>(null);

    /**
     * When a contact method button is clicked:
     * 1. Set it as active (highlights the button)
     * 2. Pre-fill the subject field based on the method
     * 3. Scroll the form into view
     */
    const handleMethodClick = (method: typeof contactMethods[0]) => {
        setActiveMethod(method.id);
        setFormData((prev) => ({ ...prev, subject: method.subject }));
        setStatus("idle");

        // Scroll to form with a slight delay for smooth UX
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
    };

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault(); // Prevent default form behavior

        setStatus("loading");

        // Log form data to console (no backend integration)
        console.log("📨 Contact form submitted:", formData);
        console.log("📋 Active method:", activeMethod);

        // Simulate sending delay
        setTimeout(() => {
            setStatus("success");
        }, 1500);
    };

    const handleSendAnother = () => {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setActiveMethod(null);
        setStatus("idle");
    };

    return (
        <div className="space-y-8">
            {/* Contact Method Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {contactMethods.map((method) => (
                    <button
                        key={method.id}
                        onClick={() => handleMethodClick(method)}
                        className={`group relative rounded-2xl p-4 text-center transition-all duration-300 border hover:scale-[1.03] hover:shadow-lg ${
                            activeMethod === method.id
                                ? "bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-300 shadow-md ring-2 ring-primary-500/20"
                                : "bg-white border-surface-200 hover:border-primary-200"
                        }`}
                    >
                        <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2.5 transition-colors ${
                                activeMethod === method.id
                                    ? "bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-sm"
                                    : "bg-gradient-to-br from-primary-100 to-secondary-100 text-primary-500 group-hover:from-primary-200 group-hover:to-secondary-200"
                            }`}
                        >
                            <method.icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-text-primary text-sm mb-0.5">{method.title}</h3>
                        <p className="text-text-muted text-xs leading-tight">{method.sub}</p>
                    </button>
                ))}
            </div>

            {/* Contact Form */}
            <div ref={formRef} className="tetradic-card rounded-2xl p-6 md:p-8">
                {status === "success" ? (
                    /* ── Success Message ── */
                    <div className="text-center py-6 animate-fadeIn">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">
                            Message Sent Successfully! 🎉
                        </h3>
                        <p className="text-text-secondary mb-6">
                            Thank you, {formData.name || "there"}! We&apos;ll get back to you within 24 hours.
                        </p>
                        <Button onClick={handleSendAnother} variant="outline" size="lg">
                            Send Another Message
                        </Button>
                    </div>
                ) : (
                    /* ── Contact Form ── */
                    <>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white">
                                <Send className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-display font-bold text-text-primary">
                                    Send Us a Message
                                </h3>
                                <p className="text-text-muted text-sm">
                                    Our team will get back to you within 24 hours.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="support-name" className="block text-sm font-medium text-text-primary mb-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        id="support-name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        placeholder="Your name"
                                        className="w-full h-11 px-4 rounded-xl border border-surface-300 bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="support-email" className="block text-sm font-medium text-text-primary mb-1.5">
                                        Email
                                    </label>
                                    <input
                                        id="support-email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full h-11 px-4 rounded-xl border border-surface-300 bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="support-subject" className="block text-sm font-medium text-text-primary mb-1.5">
                                    Subject
                                </label>
                                <input
                                    id="support-subject"
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => handleChange("subject", e.target.value)}
                                    placeholder="What is this about?"
                                    className="w-full h-11 px-4 rounded-xl border border-surface-300 bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15 transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="support-message" className="block text-sm font-medium text-text-primary mb-1.5">
                                    Message
                                </label>
                                <textarea
                                    id="support-message"
                                    rows={5}
                                    required
                                    value={formData.message}
                                    onChange={(e) => handleChange("message", e.target.value)}
                                    placeholder="Tell us how we can help..."
                                    className="w-full px-4 py-3 rounded-xl border border-surface-300 bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15 transition-colors resize-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                isLoading={status === "loading"}
                                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg"
                            >
                                <Send className="h-4 w-4" />
                                Send Message
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
