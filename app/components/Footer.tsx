"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const supportLinks = [
  { label: "Contact Us", href: "/contactUS" },
  { label: "FAQs", href: "/" },
  { label: "Shipping Info", href: "/" },
  { label: "Returns Policy", href: "/" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://twitter.com",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon
          fill="white"
          points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
        />
      </svg>
    ),
  },
];

export default function Footer() {
  const router = useRouter();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletterSubmit = () => {
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    localStorage.setItem("newsletter_email", newsletterEmail);
    setNewsletterSubmitted(true);
    setNewsletterEmail("");
  };

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 flex items-center gap-2.5 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-lg shadow-blue-200">
                <Zap className="h-5 w-5 text-white" fill="white" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold tracking-tight text-gray-900">
                  TechStore
                </span>
                <span className="text-[10px] text-blue-500 font-semibold tracking-widest uppercase">
                  Premium Tech
                </span>
              </div>
            </motion.div>

            <p className="mb-5 text-sm text-gray-500 leading-relaxed max-w-xs">
              Your destination for premium tech products at exceptional prices.
              Quality guaranteed.
            </p>

            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 font-bold text-gray-900">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map(({ label, href }) => (
                <motion.li key={label} whileHover={{ x: 4 }}>
                  <button
                    onClick={() => router.push(href)}
                    className="text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium text-left"
                  >
                    {label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-1 font-bold text-gray-900">Stay Updated</h4>
            <p className="mb-3 text-sm text-gray-500">
              Subscribe for exclusive deals and new arrivals.
            </p>

            {newsletterSubmitted ? (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
                <svg
                  className="w-4 h-4 text-green-600 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-sm font-medium text-green-800">
                  Thanks! You&apos;re subscribed.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleNewsletterSubmit()
                  }
                  className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleNewsletterSubmit}
                  className="rounded-full bg-blue-600 hover:bg-blue-700 px-5 py-2 text-sm font-semibold text-white transition-all whitespace-nowrap"
                >
                  Subscribe
                </motion.button>
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-4 px-10 flex flex-wrap gap-2">
            {[
              "🔒 Secure Payments",
              "✅ Verified Store",
              "⚡ Fast Delivery",
            ].map((badge) => (
              <span
                key={badge}
                className="pt-4 rounded-3xl border border-gray-100 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 text-sm text-gray-400 md:flex-row">
        <p>© 2025 TechStore. All rights reserved.</p>
        <div className="flex gap-6">
          <button className="hover:text-gray-700 transition-colors">
            Privacy Policy
          </button>
          <button className="hover:text-gray-700 transition-colors">
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
}
