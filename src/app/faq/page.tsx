"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqSections = [
  {
    title: "Ordering",
    items: [
      {
        q: "How do I place an order?",
        a: "Simply browse our products, add items to your cart, and proceed to checkout. You can pay using Razorpay (credit/debit cards, UPI, net banking, and wallets).",
      },
      {
        q: "Can I modify or cancel my order?",
        a: "You can modify or cancel your order within 1 hour of placing it. After that, the order enters processing and cannot be altered. Contact us at support@aielenterprises.com for assistance.",
      },
      {
        q: "Do you offer gift wrapping?",
        a: "Yes! You can add gift wrapping at checkout for ₹99. We'll include a personalised message card at no extra charge.",
      },
      {
        q: "Is there a minimum order value?",
        a: "No minimum order value is required. However, orders above ₹999 qualify for free shipping across India.",
      },
    ],
  },
  {
    title: "Shipping & Delivery",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 5–7 business days. Express shipping (₹149) delivers within 2–3 business days. Metro cities may receive orders faster.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we ship only within India. International shipping is coming soon — subscribe to our newsletter for updates!",
      },
      {
        q: "How can I track my order?",
        a: "Once shipped, you will receive a tracking link via email and SMS. You can also track your order from your account page under 'Order History'.",
      },
      {
        q: "What if my package is damaged during delivery?",
        a: "If your package arrives damaged, please contact us within 48 hours with photos. We'll arrange a free replacement or full refund.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return policy on most items. Products must be unused, in original packaging, and in the same condition you received them.",
      },
      {
        q: "How do I initiate a return?",
        a: "Go to your Account → Order History → select the order → click 'Request Return'. Our team will arrange a pickup within 2–3 business days.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are processed within 5–7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method.",
      },
      {
        q: "Are there items that cannot be returned?",
        a: "Opened STEM kits, personalised items, and sale/clearance products marked 'Final Sale' cannot be returned. Gift cards are also non-refundable.",
      },
    ],
  },
  {
    title: "Products & Safety",
    items: [
      {
        q: "Are your toys safe for children?",
        a: "Absolutely! All our products meet BIS safety standards and carry appropriate age-group labels. Magnetic products include safety warnings and are recommended for ages 8+.",
      },
      {
        q: "Do you provide warranties?",
        a: "Most products come with a 6-month manufacturer warranty against defects. STEM kits and electronics carry a 1-year warranty. See individual product pages for details.",
      },
      {
        q: "Can I get product recommendations?",
        a: "Yes! Our team loves helping you pick the perfect toy. Email us at support@aielenterprises.com with the child's age and interests, and we'll suggest products.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-surface-300 rounded-xl overflow-hidden transition-all duration-200 hover:border-primary-300/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-primary-50/30 transition-colors"
      >
        <span className="font-medium text-text-primary text-sm pr-4">{q}</span>
        <ChevronDown
          className={`h-4 w-4 text-text-muted flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180 text-primary-500" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 bg-white border-t border-surface-200">
          <p className="text-text-secondary text-sm leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Banner */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-secondary-500 via-primary-500 to-accent-500 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-1/3 w-80 h-80 bg-lime-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-400 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 rounded-2xl mb-6 backdrop-blur-sm border border-white/20">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 tracking-wide">
            Frequently Asked Questions
          </h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto">
            Everything you need to know about shopping at Aiel Enterprises.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          {faqSections.map((section) => (
            <div key={section.title} className="mb-12 last:mb-0">
              <h2 className="text-xl font-display font-bold text-text-primary mb-5 tracking-wide flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-primary-500 to-secondary-400" />
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still have questions CTA */}
      <section className="py-14 bg-gradient-to-br from-primary-50/60 to-secondary-50/40">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <h2 className="text-2xl font-display font-bold text-text-primary mb-3 tracking-wide">
            Still Have Questions?
          </h2>
          <p className="text-text-secondary mb-6">
            Our support team is always happy to help. Reach out and we&apos;ll get back to you within 24 hours.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
