import Link from "next/link"
import { X, Share2, Mail } from "lucide-react"
import type { ThemeConfig } from "@/themes/engine/schema"

const SHOP_LINKS = ["New Arrivals", "Best Sellers", "Tech Series", "Elite Footwear"]
const SUPPORT_LINKS = ["Contact Support", "Shipping & Returns", "Sizing Guide", "Order Status"]
const COMPANY_LINKS = ["Our Story", "Sustainability", "Careers", "Privacy Policy"]
const RESOURCE_LINKS = ["Training Blog", "Affiliates", "Terms of Service"]

interface PerformanceFooterProps {
  config: ThemeConfig
}

export function PerformanceFooter({ config }: PerformanceFooterProps) {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-5">
        {/* Brand */}
        <div>
          <p
            className="font-black uppercase text-white"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {config.storeName}.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-white/40">
            Precision engineered performance apparel for the dedicated athlete. Designed for
            movement, built for results.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" className="text-white/40 transition-colors hover:text-white" aria-label="X">
              <X className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <a href="#" className="text-white/40 transition-colors hover:text-white" aria-label="Share">
              <Share2 className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <a href="#" className="text-white/40 transition-colors hover:text-white" aria-label="Email">
              <Mail className="h-4 w-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
            SHOP
          </p>
          <ul className="mt-4 space-y-2.5">
            {SHOP_LINKS.map((label) => (
              <li key={label}>
                <Link href="/products" className="text-sm text-white/40 transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
            SUPPORT
          </p>
          <ul className="mt-4 space-y-2.5">
            {SUPPORT_LINKS.map((label) => (
              <li key={label}>
                <Link href="/contact" className="text-sm text-white/40 transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
            COMPANY
          </p>
          <ul className="mt-4 space-y-2.5">
            {COMPANY_LINKS.map((label) => (
              <li key={label}>
                <Link href="/about" className="text-sm text-white/40 transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
            RESOURCES
          </p>
          <ul className="mt-4 space-y-2.5">
            {RESOURCE_LINKS.map((label) => (
              <li key={label}>
                <Link href="/about" className="text-sm text-white/40 transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <p className="text-xs text-white/30">
            © 2026 {config.storeName.toUpperCase()}. PRECISION ENGINEERED.
          </p>
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-6 w-6 rounded-sm border border-white/10 bg-white/5"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
