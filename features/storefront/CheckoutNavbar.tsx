import Link from "next/link"
import type { ThemeConfig } from "@/themes/engine/schema"

interface CheckoutNavbarProps {
  config: ThemeConfig
  /** Visual shell aligned with theme chrome */
  variant?: "bento" | "minimalist" | "bold" | "fashion"
}

export function CheckoutNavbar({
  config,
  variant = "bento",
}: CheckoutNavbarProps) {
  const logoDisplay = config.logoDisplay ?? "logo"
  const showLogo = logoDisplay !== "text" && Boolean(config.logoUrl)
  const showText = logoDisplay === "text" || logoDisplay === "both" || !config.logoUrl
  const logoScale = (config.logoScale ?? 100) / 100

  if (variant === "bento") {
    return (
      <header className="sticky top-0 z-50 px-4 py-3 @2xl:px-6">
        <div className="relative mx-auto flex h-16 max-w-5xl items-center rounded-full bg-white px-6 shadow-[0px_0px_19px_rgba(0,0,0,0.25)]">
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-2 text-[#1a1c1b] transition-opacity hover:opacity-80"
            style={{ fontFamily: "var(--theme-heading-font)" }}
            aria-label="Kembali ke beranda"
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
              <span className="truncate text-lg font-bold">{config.storeName}</span>
            )}
          </Link>

          <span className="mx-3 h-4 w-px shrink-0 bg-black/15" aria-hidden />

          <span
            className="text-sm font-semibold text-[#515160]"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            Checkout
          </span>
        </div>
      </header>
    )
  }

  if (variant === "bold") {
    return (
      <header
        className="sticky top-0 z-50 border-b border-white/10 px-6 py-4"
        style={{ backgroundColor: "var(--theme-primary)" }}
      >
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Link
            href="/"
            className="truncate text-sm font-black uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-80"
            style={{ fontFamily: "var(--theme-heading-font)" }}
            aria-label="Kembali ke beranda"
          >
            {config.storeName}
          </Link>
          <span className="h-3 w-px bg-white/30" aria-hidden />
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/80">
            Checkout
          </span>
        </div>
      </header>
    )
  }

  // minimalist + fashion
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[var(--theme-bg,#fff)]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 @2xl:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 text-[var(--theme-text)] transition-opacity hover:opacity-80"
          style={{ fontFamily: "var(--theme-heading-font)" }}
          aria-label="Kembali ke beranda"
        >
          {showLogo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={config.logoUrl}
              alt={showText ? "" : config.storeName}
              className="w-auto object-contain"
              style={{ height: 28 * logoScale, maxWidth: 120 * logoScale }}
            />
          )}
          {showText && (
            <span className="truncate text-base font-semibold">{config.storeName}</span>
          )}
        </Link>
        <span className="h-3.5 w-px bg-black/15" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--theme-muted)]">
          Checkout
        </span>
      </div>
    </header>
  )
}
