import type { ThemeConfig } from "@/themes/engine/schema"

interface FooterProps {
  config: ThemeConfig
}

/** Footer Bold — isi seperti bento: brand, tagline, kontak, copyright. */
export function Footer({ config }: FooterProps) {
  const logoDisplay = config.logoDisplay ?? "logo"
  const showLogo = logoDisplay !== "text" && Boolean(config.logoUrl)
  const showText = logoDisplay === "text" || logoDisplay === "both" || !config.logoUrl
  const logoScale = (config.logoScale ?? 100) / 100

  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div>
          <p
            className="flex items-center gap-2.5 text-sm font-black uppercase tracking-[0.15em] text-white"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {showLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.logoUrl}
                alt={showText ? "" : config.storeName}
                className="w-auto object-contain"
                style={{ height: 24 * logoScale, maxWidth: 120 * logoScale }}
              />
            )}
            {showText && config.storeName}
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/40">
            {config.tagline ?? "Precision engineered for those who refuse to compromise."}
          </p>
        </div>

        {(config.contactPhone || config.contactEmail || config.contactAddress) && (
          <div className="mt-8 space-y-1.5 text-sm text-white/50">
            {config.contactAddress && (
              <p className="leading-relaxed">{config.contactAddress}</p>
            )}
            {config.contactPhone && (
              <p>
                <a href={`tel:${config.contactPhone}`} className="hover:text-white/80">
                  {config.contactPhone}
                </a>
              </p>
            )}
            {config.contactEmail && (
              <p>
                <a href={`mailto:${config.contactEmail}`} className="hover:text-white/80">
                  {config.contactEmail}
                </a>
              </p>
            )}
          </div>
        )}

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/30">
          <p>
            © {new Date().getFullYear()} {config.storeName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
