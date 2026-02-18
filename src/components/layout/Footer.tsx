import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { APP_NAME, FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/constants";

// Use static year to prevent hydration mismatch between server and client
const CURRENT_YEAR = 2026;

export function Footer() {
  const currentYear = CURRENT_YEAR;

  return (
    <footer className="bg-[#050510] text-white border-t border-white/5">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.2)]">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-display font-bold text-xl tracking-wide">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-white/40 mb-4">
              Anti-gravity toys, magnetic levitation gadgets & STEM skill toys.
              Your trusted destination for physics-defying fun.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent-400/20 hover:text-accent-400 border border-white/10 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent-400/20 hover:text-accent-400 border border-white/10 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent-400/20 hover:text-accent-400 border border-white/10 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 hover:text-accent-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 hover:text-accent-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/40">
                  123 Business Street, Mumbai, Maharashtra 400001, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent-400 flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-sm text-white/40 hover:text-accent-400 transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent-400 flex-shrink-0" />
                <a
                  href="mailto:support@aielenterprises.com"
                  className="text-sm text-white/40 hover:text-accent-400 transition-colors"
                >
                  support@aielenterprises.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/30">
              © {currentYear} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {FOOTER_LINKS.company.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-white/30 hover:text-accent-400 transition-colors"
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
