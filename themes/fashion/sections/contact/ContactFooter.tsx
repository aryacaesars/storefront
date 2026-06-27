import type { ThemeConfig } from "@/themes/engine/schema"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"

interface ContactFooterProps {
  config?: ThemeConfig
}

export function ContactFooter({ config = DEFAULT_FASHION_CONFIG }: ContactFooterProps) {
  return (
    <footer className="border-t border-stone-200 bg-(--theme-bg)">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div>
          <p
            className="mb-3 text-2xl font-medium text-(--theme-text)"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {config.storeName}
          </p>
          <p className="max-w-[190px] text-xs leading-relaxed text-(--theme-muted)">
            {config.tagline ?? "Elevating the everyday through conscious design."}
          </p>
        </div>
      </div>

      <div className="border-t border-stone-200 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <p className="text-[10px] text-(--theme-muted)">
            © 2024 {config.storeName}. All rights reserved.
          </p>
          <p className="text-[10px] text-(--theme-muted)">Global / USD</p>
        </div>
      </div>
    </footer>
  )
}
