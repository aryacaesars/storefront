import Link from "next/link"
import { Search, User, ShoppingBag } from "lucide-react"
import type { ThemeConfig } from "@/themes/engine/schema"

const NAV_LINKS = [
  { label: "Collections", href: "/products" },
  { label: "New Arrivals", href: "/products" },
  { label: "Best Sellers", href: "/products" },
  { label: "Journal", href: "/about" },
] as const

interface HeaderProps {
  config: ThemeConfig
  cartCount?: number
}

export function Header({ config, cartCount = 0 }: HeaderProps) {
  return (
    <>
      {config.bannerText && (
        <div
          className="text-center text-[11px] font-medium tracking-wide text-white px-4 py-2"
          style={{ backgroundColor: "var(--theme-primary)" }}
        >
          {config.bannerText}
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-black/5 bg-[var(--theme-bg)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
          <Link
            href="/"
            className="shrink-0 text-lg font-semibold tracking-tight text-[var(--theme-text)]"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {config.storeName}
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[11px] font-semibold tracking-[0.12em] text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)] uppercase"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              className="text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              className="text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
              aria-label="Account"
            >
              <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
            <Link
              href="/cart"
              className="relative text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
              aria-label="Cart"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--theme-primary)] text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
