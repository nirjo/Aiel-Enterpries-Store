import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { APP_NAME, FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/constants";

// Use static year to prevent hydration mismatch between server and client
const CURRENT_YEAR = 2026;

export function Footer() {
  const currentYear = CURRENT_YEAR;

  return (
    <footer className="bg-gradient-to-t from-gray-900 to-slate-900 text-white border-t border-slate-800/50">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-display font-bold text-xl tracking-wide text-white/95">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-slate-400 mb-4">
              Anti-gravity toys, magnetic levitation gadgets & STEM skill toys.
              Your trusted destination for physics-defying fun.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center hover:bg-primary-400/20 hover:text-primary-400 border border-slate-700/50 transition-all duration-200 text-slate-300 hover:scale-105"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center hover:bg-primary-400/20 hover:text-primary-400 border border-slate-700/50 transition-all duration-200 text-slate-300 hover:scale-105"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center hover:bg-primary-400/20 hover:text-primary-400 border border-slate-700/50 transition-all duration-200 text-slate-300 hover:scale-105"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white/95">Shop</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-white transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white/95">Support</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-white transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white/95">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  123 Business Street, Mumbai, Maharashtra 400001, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-sm text-slate-300 hover:text-white transition-all"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <a
                  href="mailto:support@aielenterprises.com"
                  className="text-sm text-slate-300 hover:text-white transition-all"
                >
                  support@aielenterprises.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-slate-950/50 border-t border-slate-800/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © {currentYear} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {FOOTER_LINKS.company.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-slate-400 hover:text-white transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
