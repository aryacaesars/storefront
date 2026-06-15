import { Globe, Share2, Bell } from "lucide-react"
import type { ThemeConfig } from "@/themes/engine/schema"

const SHOP_LINKS = ["New Arrivals", "Performance", "Tech Series", "Elite Gear"]
const COMPANY_LINKS = ["Our Story", "Sustainability", "Careers"]
const SUPPORT_LINKS = ["Contact Support", "Shipping & Returns", "Size Guide"]
const LEGAL_LINKS = ["Privacy Policy", "Terms of Service"]

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
        {title}
      </p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-sm text-white/40 transition-colors hover:text-white">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface NewArrivalsFooterProps {
  config: ThemeConfig
}

export function NewArrivalsFooter({ config }: NewArrivalsFooterProps) {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        {/* Main grid */}
        <div className="grid gap-8 px-6 py-14 md:grid-cols-5">
          {/* Brand col */}
          <div>
            <p
              className="text-sm font-black uppercase"
              style={{ fontFamily: "var(--theme-heading-font)", color: "var(--theme-accent)" }}
            >
              {config.storeName}
            </p>
            <p className="mt-3 max-w-[180px] text-xs leading-relaxed text-white/40">
              Precision engineered performance apparel for the elite. Built for the future.
            </p>
            <div className="mt-5 flex gap-3">
              <Globe className="h-4 w-4 cursor-pointer text-white/40 transition-colors hover:text-white" strokeWidth={1.5} />
              <Share2 className="h-4 w-4 cursor-pointer text-white/40 transition-colors hover:text-white" strokeWidth={1.5} />
              <Bell className="h-4 w-4 cursor-pointer text-white/40 transition-colors hover:text-white" strokeWidth={1.5} />
            </div>
          </div>

          <FooterCol title="SHOP" links={SHOP_LINKS} />
          <FooterCol title="COMPANY" links={COMPANY_LINKS} />
          <FooterCol title="SUPPORT" links={SUPPORT_LINKS} />
          <FooterCol title="LEGAL" links={LEGAL_LINKS} />
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-5">
          <p className="text-xs text-white/30">
            © 2024 {config.storeName.toUpperCase()}. PRECISION ENGINEERED.
          </p>
          <div className="flex gap-2">
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
