import type { ThemeConfig } from "@/themes/engine/schema"

interface FooterProps {
  config: ThemeConfig
}

export function Footer({ config }: FooterProps) {
  return (
    <footer
      className="border-t border-white/10"
      style={{ backgroundColor: "var(--theme-text)" }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2">
        <div>
          <p
            className="text-lg font-medium text-white"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {config.storeName}
          </p>
          <p className="mt-3 max-w-[200px] text-xs leading-relaxed text-white/40">
            {config.tagline}
          </p>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            CONTACT
          </p>
          {(config.contactPhone || config.contactEmail || config.contactAddress) ? (
            <div className="space-y-1.5 text-sm text-white/60">
              {config.contactAddress && (
                <p className="leading-relaxed">{config.contactAddress}</p>
              )}
              {config.contactPhone && (
                <p>
                  <a href={`tel:${config.contactPhone}`} className="hover:text-white/90">
                    {config.contactPhone}
                  </a>
                </p>
              )}
              {config.contactEmail && (
                <p>
                  <a href={`mailto:${config.contactEmail}`} className="hover:text-white/90">
                    {config.contactEmail}
                  </a>
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-white/40">Kontak belum diatur</p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="mx-auto flex max-w-7xl justify-between px-6">
          <p className="text-xs text-white/30">
            © 2026 {config.storeName}. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-white/30">
            <span>Terms of Service</span>
            <span>Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
