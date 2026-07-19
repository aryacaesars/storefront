import Link from "next/link"
import { HeaderActions } from "./HeaderActions"
import type { ThemeConfig } from "@/themes/engine/schema"
import { isNavHrefAvailable } from "@/themes/engine/nav-utils"
import { withBasePath } from "@/themes/engine/with-base-path"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
] as const

interface HeaderProps {
  config: ThemeConfig
  cartCount?: number
  basePath?: string
}

export function Header({ config, cartCount = 0, basePath }: HeaderProps) {
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
          className="px-4 py-2 text-center text-[11px] font-semibold tracking-wide text-white"
          style={{ backgroundColor: "var(--theme-primary)" }}
        >
          {config.bannerText}
        </div>
      )}

      <header className="sticky top-0 z-50 px-4 py-3 @2xl:px-6">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-full bg-white px-6 shadow-[0px_0px_19px_rgba(0,0,0,0.25)]">
          <Link
            href={withBasePath("/", basePath)}
            className="flex shrink-0 items-center gap-2 text-[#1a1c1b]"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {showLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.logoUrl}
                alt={showText ? "" : config.storeName}
                className="w-auto object-contain"
                style={{ height: 24 * logoScale, maxWidth: 32 * logoScale }}
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
                href={withBasePath(href, basePath)}
                className="text-base font-normal text-[#515160] transition-colors hover:text-[var(--theme-primary)]"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center">
            <HeaderActions
              basePath={basePath}
              cartCount={cartCount}
              links={visibleLinks}
            />
          </div>
        </div>
      </header>
    </>
  )
}
