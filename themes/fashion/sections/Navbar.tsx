import Link from "next/link"
import { ShoppingBag, User } from "lucide-react"
import type { ThemeConfig } from "@/themes/engine/schema"
import { isNavHrefAvailable } from "@/themes/engine/nav-utils"
import { withBasePath } from "@/themes/engine/with-base-path"
import { MobileNav } from "@/themes/fashion/sections/MobileNav"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
] as const

interface NavbarProps {
  config: ThemeConfig
  basePath?: string
}

export function Navbar({ config, basePath }: NavbarProps) {
  const visibleLinks = NAV_LINKS.filter((link) =>
    isNavHrefAvailable(config.templateId, link.href),
  )

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur-sm">
      <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link
          href={withBasePath("/", basePath)}
          className="font-medium text-lg text-[var(--theme-text)]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {config.storeName}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {visibleLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={withBasePath(href, basePath)}
              className="text-xs tracking-[0.1em] text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={withBasePath("/cart", basePath)}
            aria-label="Cart"
            className="text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          {!basePath && (
            <Link
              href="/account"
              aria-label="Account"
              className="text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
            >
              <User className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          )}
          <MobileNav links={visibleLinks} basePath={basePath} />
        </div>
      </div>
    </nav>
  )
}
