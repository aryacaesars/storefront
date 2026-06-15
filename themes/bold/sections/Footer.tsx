import Link from "next/link"
import { X, Share2, Mail } from "lucide-react"
import type { ThemeConfig } from "@/themes/engine/schema"

interface FooterProps {
  config: ThemeConfig
}

export function Footer({ config }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        {/* Brand */}
        <div>
          <p
            className="font-black uppercase text-white"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {config.storeName}
          </p>
          <p className="mt-3 text-sm text-white/40">{config.tagline}</p>
          <div className="mt-5 flex gap-4">
            <a
              href="#"
              className="text-white/40 transition-colors hover:text-white"
              aria-label="Twitter"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <a
              href="#"
              className="text-white/40 transition-colors hover:text-white"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <a
              href="#"
              className="text-white/40 transition-colors hover:text-white"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Brand links */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
            BRAND
          </p>
          <ul className="mt-4 space-y-2.5">
            {["Our Story", "Sustainability", "Lab Reports", "Careers"].map((label) => (
              <li key={label}>
                <Link
                  href="/about"
                  className="text-sm text-white/40 transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support links */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
            SUPPORT
          </p>
          <ul className="mt-4 space-y-2.5">
            {[
              "Contact Support",
              "Shipping & Returns",
              "Privacy Policy",
              "Terms of Service",
            ].map((label) => (
              <li key={label}>
                <Link
                  href="/contact"
                  className="text-sm text-white/40 transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
            NEWSLETTER
          </p>
          <p className="mt-4 text-sm text-white/40">
            Access early release drops and technical insights.
          </p>
          <form className="mt-4 flex">
            <input
              type="email"
              placeholder="Email address"
              className="h-10 flex-1 border border-r-0 border-white/20 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/40"
            />
            <button
              type="submit"
              className="px-4 text-xs font-black uppercase tracking-[0.1em] text-zinc-900 transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--theme-accent)" }}
            >
              JOIN
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="text-center text-xs text-white/30">
          © 2026 {config.storeName}. Precision Engineering.
        </p>
      </div>
    </footer>
  )
}
