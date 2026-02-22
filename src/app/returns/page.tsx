import type { Metadata } from "next";
import { RotateCcw, CheckCircle2, XCircle, Clock, Package, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "Aiel Enterprises returns and refund policy. Easy 30-day returns on all products.",
};

const steps = [
  {
    step: 1,
    title: "Initiate Return",
    description: "Log in → Account → Order History → Select order → 'Request Return'. Choose the reason and confirm.",
  },
  {
    step: 2,
    title: "Schedule Pickup",
    description: "Our logistics partner will contact you to arrange a convenient pickup within 2–3 business days.",
  },
  {
    step: 3,
    title: "Quality Check",
    description: "Once we receive the item, our team inspects it within 1–2 business days to verify its condition.",
  },
  {
    step: 4,
    title: "Refund Processed",
    description: "Approved refunds are credited to your original payment method within 5–7 business days.",
  },
];

const eligible = [
  "Unused products in original, undamaged packaging",
  "Products received damaged or defective",
  "Wrong item delivered",
  "Items returned within 30 days of delivery",
  "Products with all accessories, tags, and manuals intact",
];

const notEligible = [
  "Opened STEM kits, chemistry sets, or consumable products",
  "Products marked as 'Final Sale' or 'Non-Returnable'",
  "Items without original packaging or missing accessories",
  "Products damaged due to misuse or negligence",
  "Gift cards and digital downloads",
  "Items returned after 30 days of delivery",
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Banner */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-accent-500 via-primary-500 to-secondary-500 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-0 w-80 h-80 bg-lime-400 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary-400 rounded-full blur-3xl translate-y-1/3" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 rounded-2xl mb-6 backdrop-blur-sm border border-white/20">
            <RotateCcw className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 tracking-wide">
            Returns & Refunds
          </h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto">
            Not satisfied? No worries — our 30-day return policy has you covered.
          </p>
        </div>
      </section>

      {/* Return Process Steps */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-text-primary mb-10 tracking-wide text-center">
            How Returns Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 max-w-5xl mx-auto mb-16">
            {steps.map((s, idx) => (
              <div key={s.step} className="relative">
                <div className="tetradic-card rounded-2xl p-6 text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-400 flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg shadow-md">
                    {s.step}
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">{s.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{s.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-primary-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Eligibility */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Eligible */}
            <div className="tetradic-card rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 className="h-5 w-5 text-secondary-400" />
                <h3 className="font-display font-bold text-text-primary tracking-wide">
                  Eligible for Return
                </h3>
              </div>
              <ul className="space-y-3">
                {eligible.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <CheckCircle2 className="h-4 w-4 text-secondary-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Eligible */}
            <div className="tetradic-card rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-5">
                <XCircle className="h-5 w-5 text-accent-500" />
                <h3 className="font-display font-bold text-text-primary tracking-wide">
                  Not Eligible for Return
                </h3>
              </div>
              <ul className="space-y-3">
                {notEligible.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <XCircle className="h-4 w-4 text-accent-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Refund Timeline */}
          <div className="max-w-3xl mx-auto">
            <div className="tetradic-card rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-5">
                <Clock className="h-5 w-5 text-primary-500" />
                <h3 className="font-display font-bold text-text-primary tracking-wide">
                  Refund Timeline
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-primary-100/50">
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">Payment Method</th>
                      <th className="text-center py-3 px-4 font-semibold text-text-primary">Refund Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-surface-200">
                      <td className="py-3 px-4 text-text-secondary">UPI (GPay, PhonePe, etc.)</td>
                      <td className="py-3 px-4 text-center font-medium text-secondary-500">1–3 business days</td>
                    </tr>
                    <tr className="border-b border-surface-200 bg-surface-100">
                      <td className="py-3 px-4 text-text-secondary">Credit / Debit Card</td>
                      <td className="py-3 px-4 text-center font-medium text-secondary-500">5–7 business days</td>
                    </tr>
                    <tr className="border-b border-surface-200">
                      <td className="py-3 px-4 text-text-secondary">Net Banking</td>
                      <td className="py-3 px-4 text-center font-medium text-secondary-500">5–7 business days</td>
                    </tr>
                    <tr className="bg-surface-100">
                      <td className="py-3 px-4 text-text-secondary">Wallet (Paytm, Amazon Pay, etc.)</td>
                      <td className="py-3 px-4 text-center font-medium text-secondary-500">1–2 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Exchange Note */}
          <div className="max-w-3xl mx-auto mt-8">
            <div className="rounded-2xl p-6 bg-gradient-to-br from-primary-50/80 to-secondary-50/60 border border-primary-200/30">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">Prefer an Exchange?</h4>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    We offer free exchanges on all eligible items. Simply select &quot;Exchange&quot;
                    instead of &quot;Return&quot; when initiating the process. The replacement will
                    be shipped as soon as we receive the original item.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-br from-primary-50/60 to-secondary-50/40">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <h2 className="text-2xl font-display font-bold text-text-primary mb-3 tracking-wide">
            Need Help With a Return?
          </h2>
          <p className="text-text-secondary mb-6">
            Our support team is ready to assist you with any return or refund queries.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
}
