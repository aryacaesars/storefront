import type { ThemeConfig } from "@/themes/engine/schema"

interface FooterProps {
  config: ThemeConfig
}

export function Footer({ config }: FooterProps) {
  const logoDisplay = config.logoDisplay ?? "logo"
  // Sama dengan Header: tanpa logoUrl selalu jatuh ke teks.
  const showLogo = logoDisplay !== "text" && Boolean(config.logoUrl)
  const showText = logoDisplay === "text" || logoDisplay === "both" || !config.logoUrl

  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 @2xl:grid-cols-2">
        <div>
          <p
            className="flex items-center gap-2.5 text-base font-semibold text-[var(--theme-text)]"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {showLogo && (
              // <img> biasa (bukan next/image) supaya logo SVG juga jalan.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.logoUrl}
                alt={showText ? "" : config.storeName}
                className="h-8 w-auto max-w-[160px] object-contain"
              />
            )}
            {showText && config.storeName}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--theme-muted)]">
            {config.tagline ??
              "Curated essentials for the intentional lifestyle."}
          </p>
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
        <div className="mx-auto flex max-w-7xl px-6 py-5 text-xs text-[var(--theme-muted)]">
          <p>© {new Date().getFullYear()} {config.storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
