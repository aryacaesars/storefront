import Link from "next/link"
import { Share2, Globe } from "lucide-react"
import type { ThemeConfig } from "@/themes/engine/schema"

interface FooterProps {
  config: ThemeConfig
}

export function Footer({ config }: FooterProps) {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <p
            className="text-base font-semibold text-[var(--theme-text)]"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {config.storeName}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--theme-muted)]">
            {config.tagline ??
              "Curated essentials for the intentional lifestyle."}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[var(--theme-text)] uppercase">
            Shop
          </p>
          <ul className="mt-4 space-y-2.5">
            {[
              { label: "New Arrivals", href: "/products" },
              { label: "Best Sellers", href: "/products" },
              { label: "Collections", href: "/products" },
              { label: "All Products", href: "/products" },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-sm text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[var(--theme-text)] uppercase">
            Support
          </p>
          <ul className="mt-4 space-y-2.5">
            {[
              { label: "Our Story", href: "/about" },
              { label: "Shipping & Returns", href: "/contact" },
              { label: "Contact Us", href: "/contact" },
              { label: "Privacy Policy", href: "/contact" },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-sm text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[var(--theme-text)] uppercase">
            Newsletter
          </p>
          <p className="mt-4 text-sm text-[var(--theme-muted)]">
            Join our circle for early access and curated edits.
          </p>
          <form className="mt-4 flex gap-0">
            <input
              type="email"
              placeholder="Email address"
              className="h-10 flex-1 rounded-l-lg border border-r-0 border-gray-200 bg-white px-3 text-sm outline-none focus:border-[var(--theme-primary)]"
            />
            <button
              type="submit"
              className="rounded-r-lg px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--theme-primary)" }}
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-black/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 text-xs text-[var(--theme-muted)] sm:flex-row">
          <p>© {new Date().getFullYear()} {config.storeName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-[var(--theme-text)]" aria-label="Social">
              <Share2 className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <a href="#" className="transition-colors hover:text-[var(--theme-text)]" aria-label="Website">
              <Globe className="h-4 w-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
