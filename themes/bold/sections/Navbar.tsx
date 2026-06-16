import Link from "next/link"
import { Search, ShoppingBag, Menu, User } from "lucide-react"
import type { ThemeConfig } from "@/themes/engine/schema"
import { isNavHrefAvailable } from "@/themes/engine/nav-utils"
import { NavLinksClient } from "@/themes/bold/sections/NavLinksClient"
import type { ResolvedNavLink } from "@/themes/bold/sections/NavLinksClient"

const NAV_LINKS: Array<{
  label: string
  href: string
  key: string
  sectionId?: string
}> = [
  { label: "Performance", href: "/products", key: "performance", sectionId: "section-performance" },
  { label: "New Arrivals", href: "/new-arrivals", key: "new-arrivals" },
  { label: "Tech Series", href: "/tech-series", key: "tech-series" },
  { label: "All Products", href: "/all-products", key: "all-products" },
  { label: "About", href: "/about", key: "about" },
]

const PREVIEW_MAP: Record<string, string> = {
  "/products": "",
  "/all-products": "/all-products",
  "/new-arrivals": "/new-arrivals",
  "/tech-series": "/tech-series",
  "/about": "/about",
}

function resolveHref(href: string, basePath?: string): string {
  if (!basePath) return href
  const suffix = PREVIEW_MAP[href] ?? ""
  return `${basePath}${suffix}` || basePath
}

interface NavbarProps {
  config: ThemeConfig
  cartCount?: number
  basePath?: string
  activeKey?: string
}

export function Navbar({ config, cartCount = 0, basePath, activeKey }: NavbarProps) {
  const visibleLinks = NAV_LINKS.filter((link) =>
    isNavHrefAvailable(config.templateId, link.href),
  )

  const resolvedLinks: ResolvedNavLink[] = visibleLinks.map((link) => ({
    label: link.label,
    resolvedHref: resolveHref(link.href, basePath),
    key: link.key,
    sectionId: link.sectionId,
  }))

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10"
      style={{ backgroundColor: "#090909" }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link
          href={basePath ?? "/"}
          className="text-sm font-black uppercase tracking-[0.2em] text-white"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {config.storeName}
        </Link>

        <NavLinksClient links={resolvedLinks} defaultActiveKey={activeKey} />

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-white/80 transition-colors hover:text-white"
            aria-label="Search"
          >
            <Search className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <Link
            href="/account"
            className="text-white/80 transition-colors hover:text-white"
            aria-label="Account"
          >
            <User className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link
            href={resolveHref("/cart", basePath)}
            className="flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            aria-label="Cart"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.15em]">CART</span>
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-zinc-900"
                style={{ backgroundColor: "var(--theme-accent)" }}
              >
                {cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="text-white/80 transition-colors hover:text-white md:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  )
}
