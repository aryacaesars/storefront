import Link from "next/link"
import { Search, ShoppingBag, User } from "lucide-react"
import type { ThemeConfig } from "@/themes/engine/schema"
import { isNavHrefAvailable } from "@/themes/engine/nav-utils"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const

function resolveHref(href: string, basePath?: string): string {
  if (!basePath) return href
  const map: Record<string, string> = {
    "/": basePath,
    "/shop": basePath + "/shop",
    "/collections": basePath + "/collections",
    "/about": basePath + "/about",
    "/contact": basePath + "/contact",
  }
  return map[href] ?? href
}

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
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link
          href={resolveHref("/", basePath)}
          className="font-medium text-lg text-[var(--theme-text)]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {config.storeName}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {visibleLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={resolveHref(href, basePath)}
              className="text-xs tracking-[0.1em] text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Search"
            className="text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
          >
            <Search className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Cart"
            className="text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className="text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
          >
            <User className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </nav>
  )
}
