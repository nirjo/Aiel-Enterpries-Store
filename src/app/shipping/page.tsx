import type { Metadata } from "next";
import { Truck, Clock, MapPin, IndianRupee, PackageCheck, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Information",
  description: "Learn about Aiel Enterprises shipping options, delivery timelines, and costs across India.",
};

const shippingMethods = [
  {
    icon: Truck,
    name: "Standard Shipping",
    time: "5–7 Business Days",
    cost: "Free over ₹999 · ₹79 otherwise",
    gradient: "from-primary-100 to-secondary-100",
  },
  {
    icon: Clock,
    name: "Express Shipping",
    time: "2–3 Business Days",
    cost: "₹149 flat rate",
    gradient: "from-secondary-100 to-lime-100",
  },
  {
    icon: PackageCheck,
    name: "Same-Day Delivery",
    time: "Within 24 Hours",
    cost: "₹299 · Select cities only",
    gradient: "from-accent-100 to-primary-100",
  },
];

const zones = [
  { zone: "Metro Cities", cities: "Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad", standard: "4–5 days", express: "1–2 days" },
  { zone: "Tier-1 Cities", cities: "Jaipur, Pune, Ahmedabad, Lucknow, Chandigarh & more", standard: "5–6 days", express: "2–3 days" },
  { zone: "Tier-2 & Beyond", cities: "All other serviceable pin codes", standard: "6–8 days", express: "3–4 days" },
  { zone: "North-East & Remote", cities: "Assam, Meghalaya, Manipur, Andaman & more", standard: "8–12 days", express: "4–6 days" },
];

const policies = [
  {
    icon: MapPin,
    title: "Delivery Coverage",
    text: "We deliver to all serviceable pin codes across India. Enter your pin code at checkout to check availability.",
  },
  {
    icon: PackageCheck,
    title: "Order Tracking",
    text: "Track your order in real time from your Account → Order History. You'll also receive email and SMS updates at every stage.",
  },
  {
    icon: IndianRupee,
    title: "Free Shipping",
    text: "All orders above ₹999 qualify for free standard shipping. No coupon needed — applied automatically at checkout!",
  },
  {
    icon: ShieldCheck,
    title: "Secure Packaging",
    text: "Every product is packed with bubble wrap, foam inserts, and tamper-proof seals to ensure it arrives in perfect condition.",
  },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Banner */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-primary-600 via-secondary-500 to-lime-500 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent-400 rounded-full blur-3xl translate-x-1/4 -translate-y-1/2" />
          <div className="absolute bottom-0 left-1/4 w-56 h-56 bg-primary-400 rounded-full blur-3xl translate-y-1/3" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 rounded-2xl mb-6 backdrop-blur-sm border border-white/20">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 tracking-wide">
            Shipping Information
          </h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto">
            Fast, reliable delivery across India — your orders are on their way!
          </p>
        </div>
      </section>

      {/* Shipping Methods */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-text-primary mb-8 tracking-wide text-center">
            Shipping Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-16">
            {shippingMethods.map((method) => (
              <div
                key={method.name}
                className="tetradic-card rounded-2xl p-6 text-center hover:scale-[1.03] transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.gradient} flex items-center justify-center mx-auto mb-4 border border-primary-200/50`}>
                  <method.icon className="h-6 w-6 text-primary-500" />
                </div>
                <h3 className="font-semibold text-text-primary mb-1">{method.name}</h3>
                <p className="text-secondary-500 font-bold text-sm mb-1">{method.time}</p>
                <p className="text-text-muted text-xs">{method.cost}</p>
              </div>
            ))}
          </div>

          {/* Delivery Zones Table */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-6 tracking-wide text-center">
              Delivery Timelines by Zone
            </h2>
            <div className="tetradic-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-primary-100/50">
                      <th className="text-left px-6 py-4 font-semibold text-text-primary">Zone</th>
                      <th className="text-left px-6 py-4 font-semibold text-text-primary">Coverage</th>
                      <th className="text-center px-6 py-4 font-semibold text-text-primary">Standard</th>
                      <th className="text-center px-6 py-4 font-semibold text-text-primary">Express</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones.map((zone, idx) => (
                      <tr
                        key={zone.zone}
                        className={`border-b border-surface-200 last:border-0 ${
                          idx % 2 === 0 ? "bg-white" : "bg-surface-100"
                        }`}
                      >
                        <td className="px-6 py-3.5 font-medium text-text-primary whitespace-nowrap">
                          {zone.zone}
                        </td>
                        <td className="px-6 py-3.5 text-text-secondary">{zone.cities}</td>
                        <td className="px-6 py-3.5 text-center text-text-secondary">
                          {zone.standard}
                        </td>
                        <td className="px-6 py-3.5 text-center font-medium text-secondary-500">
                          {zone.express}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-8 tracking-wide text-center">
              Shipping Policies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {policies.map((policy) => (
                <div
                  key={policy.title}
                  className="tetradic-card rounded-2xl p-6 flex gap-4 items-start hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0 border border-primary-200/50">
                    <policy.icon className="h-5 w-5 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">{policy.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{policy.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
