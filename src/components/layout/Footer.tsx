import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { APP_NAME, FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/constants";

const CURRENT_YEAR = 2026;

export function Footer() {
  const currentYear = CURRENT_YEAR;

  return (
    <footer className="bg-gradient-to-t from-primary-900 via-[#0f0f23] to-[#0f0f23] text-white border-t border-primary-500/20">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <BrandLogo className="scale-75 sm:scale-90 origin-left" variant="dark" />
            </Link>
            <p className="text-sm text-white/50 mb-4">
              Toys, home essentials, electronics & gifts — your one-stop family store.
              Quality products for every age and need.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: SOCIAL_LINKS.facebook, Icon: Facebook },
                { href: SOCIAL_LINKS.instagram, Icon: Instagram },
                { href: SOCIAL_LINKS.twitter, Icon: Twitter },
              ].map(({ href, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-primary-500/15 flex items-center justify-center hover:bg-secondary-400/20 hover:text-secondary-400 border border-primary-500/20 transition-all duration-200 text-white/60 hover:scale-105"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white/95">Shop</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-secondary-400 transition-all">
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
                  <Link href={link.href} className="text-sm text-white/50 hover:text-secondary-400 transition-all">
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
                <MapPin className="h-5 w-5 text-lime-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/50">
                  123 Business Street, Mumbai, Maharashtra 400001, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-lime-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-sm text-white/50 hover:text-secondary-400 transition-all">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-lime-400 flex-shrink-0" />
                <a href="mailto:support@aielenterprises.com" className="text-sm text-white/50 hover:text-secondary-400 transition-all">
                  support@aielenterprises.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-primary-900/50 border-t border-primary-500/15">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/40">
              © {currentYear} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {FOOTER_LINKS.company.map((link) => (
                <Link key={link.href} href={link.href} className="text-xs text-white/40 hover:text-lime-400 transition-all">
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
