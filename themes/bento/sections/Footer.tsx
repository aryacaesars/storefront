import type { ThemeConfig } from "@/themes/engine/schema"

interface FooterProps {
  config: ThemeConfig
}

export function Footer({ config }: FooterProps) {
  const logoDisplay = config.logoDisplay ?? "logo"
  const showLogo = logoDisplay !== "text" && Boolean(config.logoUrl)
  const showText = logoDisplay === "text" || logoDisplay === "both" || !config.logoUrl
  const logoScale = (config.logoScale ?? 100) / 100

  return (
    <footer className="px-4 pb-10 pt-6 @2xl:px-6">
      <div className="mx-auto max-w-7xl rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.15)] @2xl:p-12">
        <div>
          <p
            className="flex items-center gap-2 text-base font-bold text-[#1a1c1b]"
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
            {showText && config.storeName}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#515160]">
            {config.tagline ?? "Bold products. Bolder design."}
          </p>
        </div>

        {(config.contactPhone || config.contactEmail || config.contactAddress) && (
          <div className="mt-8 space-y-1.5 text-sm text-[#515160]">
            {config.contactAddress && <p className="leading-relaxed">{config.contactAddress}</p>}
            {config.contactPhone && (
              <p>
                <a href={`tel:${config.contactPhone}`} className="hover:text-[#1a1c1b]">
                  {config.contactPhone}
                </a>
              </p>
            )}
            {config.contactEmail && (
              <p>
                <a href={`mailto:${config.contactEmail}`} className="hover:text-[#1a1c1b]">
                  {config.contactEmail}
                </a>
              </p>
            )}
          </div>
        )}

        <div className="mt-10 border-t border-gray-100 pt-6 text-xs text-[#515160]">
          <p>© {new Date().getFullYear()} {config.storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
