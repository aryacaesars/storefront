import Link from "next/link"
import { Globe, Heart, Share2 } from "lucide-react"
import type { ThemeConfig } from "@/themes/engine/schema"

interface FooterProps {
  config: ThemeConfig
}

export function Footer({ config }: FooterProps) {
  return (
    <footer
      className="border-t border-white/10"
      style={{ backgroundColor: "var(--theme-text)" }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <p
            className="text-lg font-medium text-white"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {config.storeName}
          </p>
          <p className="mt-3 max-w-[200px] text-xs leading-relaxed text-white/40">
            {config.tagline}
          </p>
          <div className="mt-5 flex gap-3">
            <Globe className="h-4 w-4 cursor-pointer text-white/40 hover:text-white" />
            <Heart className="h-4 w-4 cursor-pointer text-white/40 hover:text-white" />
            <Share2 className="h-4 w-4 cursor-pointer text-white/40 hover:text-white" />
          </div>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            COLLECTIONS
          </p>
          <ul className="space-y-2.5">
            {["New Arrivals", "Best Sellers", "Signature Silk", "Essential Knits"].map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="text-sm text-white/40 transition-colors hover:text-white/80"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            INFORMATION
          </p>
          <ul className="space-y-2.5">
            {["Sustainability", "Journal", "Privacy Policy", "Shipping & Returns"].map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="text-sm text-white/40 transition-colors hover:text-white/80"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            CONTACT
          </p>
          <p className="text-sm text-white/60">hello@lunasoft.com</p>
          <div className="mt-4 flex gap-3">
            <Globe className="h-4 w-4 cursor-pointer text-white/40 hover:text-white" />
            <Heart className="h-4 w-4 cursor-pointer text-white/40 hover:text-white" />
            <Share2 className="h-4 w-4 cursor-pointer text-white/40 hover:text-white" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="mx-auto flex max-w-7xl justify-between px-6">
          <p className="text-xs text-white/30">
            © 2026 {config.storeName}. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-white/30">
            <span>Terms of Service</span>
            <span>Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
