import Link from "next/link"
import { User, ShoppingBag } from "lucide-react"
import { MobileNav } from "./MobileNav"
import type { ThemeConfig } from "@/themes/engine/schema"
import { isNavHrefAvailable } from "@/themes/engine/nav-utils"
import { withBasePath } from "@/themes/engine/with-base-path"

const NAV_LINKS = [
  { label: "Collections", href: "/products" },
  { label: "New Arrivals", href: "/products" },
  { label: "Best Sellers", href: "/products" },
  { label: "Journal", href: "/about" },
] as const

interface HeaderProps {
  config: ThemeConfig
  cartCount?: number
  basePath?: string
  /** Nama customer yang sedang login — tampil di sebelah ikon profile. */
  customerName?: string | null
}

export function Header({ config, cartCount = 0, basePath, customerName }: HeaderProps) {
  const logoDisplay = config.logoDisplay ?? "logo"
  const showLogo = logoDisplay !== "text" && Boolean(config.logoUrl)
  const showText = logoDisplay === "text" || logoDisplay === "both" || !config.logoUrl
  const logoScale = (config.logoScale ?? 100) / 100
  const visibleLinks = NAV_LINKS.filter((link) =>
    isNavHrefAvailable(config.templateId, link.href),
  )

  return (
    <>
      {config.bannerText && (
        <div
          className="px-4 py-2 text-center text-[11px] font-medium tracking-wide text-white"
          style={{ backgroundColor: "var(--theme-primary)" }}
        >
          {config.bannerText}
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-black/5 bg-[var(--theme-bg)]/95 backdrop-blur-sm">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 @2xl:gap-6 @2xl:px-6">
          <Link
            href={withBasePath("/", basePath)}
            className="flex shrink-0 items-center gap-2.5 text-lg font-semibold tracking-tight text-[var(--theme-text)]"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {showLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.logoUrl}
                alt={showText ? "" : config.storeName}
                className="w-auto object-contain"
                style={{ height: 32 * logoScale, maxWidth: 160 * logoScale }}
              />
            )}
            {showText && config.storeName}
          </Link>

          <nav className="hidden items-center gap-8 @3xl:flex">
            {visibleLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={withBasePath(href, basePath)}
                className="text-[11px] font-semibold tracking-[0.12em] text-[var(--theme-muted)] uppercase transition-colors hover:text-[var(--theme-text)]"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3 @2xl:gap-4">
            {!basePath && (
              <Link
                href="/account"
                className="flex items-center gap-1.5 text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
                aria-label="Account"
              >
                <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {customerName && (
                  <span className="hidden max-w-[120px] truncate text-xs font-semibold text-[var(--theme-text)] @2xl:inline">
                    {customerName.trim().split(/\s+/)[0]}
                  </span>
                )}
              </Link>
            )}
            <Link
              href={withBasePath("/cart", basePath)}
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

            <MobileNav links={visibleLinks} basePath={basePath} />
          </div>
        </div>
      </header>
    </>
  )
}
