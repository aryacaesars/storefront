import Link from "next/link"
import { Search, User, ShoppingBag } from "lucide-react"
import { MobileNav } from "./MobileNav"
import type { ThemeConfig } from "@/themes/engine/schema"
import { isNavHrefAvailable } from "@/themes/engine/nav-utils"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "About", href: "/about" },
] as const

interface HeaderProps {
  config: ThemeConfig
  cartCount?: number
  basePath?: string
}

function resolveHref(href: string, basePath?: string): string {
  if (!basePath) return href
  if (href === "/") return basePath
  return `${basePath}${href}`
}

export function Header({ config, cartCount = 0, basePath }: HeaderProps) {
  const logoDisplay = config.logoDisplay ?? "logo"
  const showLogo = logoDisplay !== "text" && Boolean(config.logoUrl)
  const showText = logoDisplay === "text" || logoDisplay === "both" || !config.logoUrl
  const visibleLinks = NAV_LINKS.filter((link) =>
    isNavHrefAvailable(config.templateId, link.href),
  )

  return (
    <>
      {config.bannerText && (
        <div
          className="px-4 py-2 text-center text-[11px] font-semibold tracking-wide text-white"
          style={{ backgroundColor: "var(--theme-primary)" }}
        >
          {config.bannerText}
        </div>
      )}

      <header className="sticky top-0 z-50 px-4 py-3 @2xl:px-6">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-full bg-white px-6 shadow-[0px_0px_19px_rgba(0,0,0,0.25)]">
          <Link
            href={resolveHref("/", basePath)}
            className="flex shrink-0 items-center gap-2 text-[#1a1c1b]"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {showLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.logoUrl}
                alt={showText ? "" : config.storeName}
                className="h-6 w-auto max-w-[32px] object-contain"
              />
            )}
            {showText && (
              <span className="text-xl font-bold">{config.storeName}</span>
            )}
          </Link>

          <nav className="hidden items-center gap-6 @3xl:flex">
            {visibleLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={resolveHref(href, basePath)}
                className="text-base font-normal text-[#515160] transition-colors hover:text-[var(--theme-primary)]"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <div
              className="hidden items-center gap-0.5 rounded-full px-2 py-1 @2xl:flex"
              style={{ backgroundColor: "var(--theme-primary)" }}
            >
                  <button
              type="button"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80 @2xl:flex"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
              <Link
                href={resolveHref("/account", basePath)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
                aria-label="Account"
              >
                <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </Link>

              <Link
                href={resolveHref("/cart", basePath)}
                className="relative flex h-8 w-8 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
                aria-label="Cart"
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[var(--theme-primary)]">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            <MobileNav links={visibleLinks} basePath={basePath} />
          </div>
        </div>
      </header>
    </>
  )
}
