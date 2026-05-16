"use client";

/**
 * Contact Page — Client Component
 *
 * WHY "use client"?
 *   This component uses useState for form state, onSubmit for form submission,
 *   and fetch() to call the /api/contact endpoint. None of these are available
 *   in Server Components.
 */

import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Loader2 } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    detail: "support@aielenterprises.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: Phone,
    title: "Call Us",
    detail: "+91 9150234277",
    sub: "Mon–Sat, 10 AM – 7 PM IST",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "No.4, 1st Cross Street, GT Nagar",
    sub: "Thattanchavady, Puducherry-605009, India",
  },
  {
    icon: Clock,
    title: "Business Hours",
    detail: "Mon – Sat: 10 AM – 7 PM",
    sub: "Sun: Closed",
  },
];

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", subject: "", message: "" });
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* Hero Banner */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-400 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 tracking-wide">
            Contact Us
          </h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto">
            Have a question about our products? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="tetradic-card rounded-2xl p-6 text-center hover:scale-[1.03] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mx-auto mb-4 border border-primary-200/50">
                  <item.icon className="h-6 w-6 text-primary-500" />
                </div>
                <h3 className="font-semibold text-text-primary mb-1">{item.title}</h3>
                <p className="text-text-secondary font-medium text-sm">{item.detail}</p>
                <p className="text-text-muted text-xs mt-1">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="tetradic-card rounded-2xl p-8 md:p-10">
              {status === "success" ? (
                /* ── Success State ── */
                <div className="text-center py-6 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    Message Sent Successfully! 🎉
                  </h3>
                  <p className="text-text-secondary mb-2">
                    Thank you, {formData.name || "there"}! We&apos;ve sent a confirmation to your email.
                  </p>
                  <p className="text-text-muted text-sm mb-6">
                    Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 h-11 px-6 rounded-xl border border-surface-300 bg-white text-text-primary font-medium hover:bg-surface-50 active:scale-[0.98] transition-all duration-200"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                /* ── Form State ── */
                <>
                  <h2 className="text-2xl font-display font-bold text-text-primary mb-2 tracking-wide">
                    Send Us a Message
                  </h2>
                  <p className="text-text-secondary mb-8">
                    Fill out the form and our team will get back to you within 24 hours.
                  </p>

                  {/* Error Alert */}
                  {status === "error" && errorMsg && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-medium text-text-primary mb-1.5"
                        >
                          Full Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Your name"
                          className="w-full h-11 px-4 rounded-xl border border-surface-300 bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15 transition-colors"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-medium text-text-primary mb-1.5"
                        >
                          Email
                        </label>
                        <input
                          id="contact-email"
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
                      <label
                        htmlFor="contact-subject"
                        className="block text-sm font-medium text-text-primary mb-1.5"
                      >
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        placeholder="What is this about?"
                        className="w-full h-11 px-4 rounded-xl border border-surface-300 bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15 transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-medium text-text-primary mb-1.5"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Tell us how we can help..."
                        className="w-full px-4 py-3 rounded-xl border border-surface-300 bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15 transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
