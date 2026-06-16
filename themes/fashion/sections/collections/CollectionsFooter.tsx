import type { ThemeConfig } from "@/themes/engine/schema"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"

interface CollectionsFooterProps {
  config?: ThemeConfig
}

export function CollectionsFooter({ config = DEFAULT_FASHION_CONFIG }: CollectionsFooterProps) {
  return (
    <footer className="bg-[var(--theme-text)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <p
            className="mb-4 text-2xl font-medium text-white"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {config.storeName}
          </p>
          <p className="max-w-[200px] text-xs leading-relaxed text-white/40">
            {config.tagline ?? "Crafting timeless elegance through conscious design."}
          </p>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            CLIENT CARE
          </p>
          {["Shipping & Returns", "Sizing Guide", "Contact Us"].map((item) => (
            <a
              key={item}
              href="#"
              className="mb-2.5 block text-xs text-white/40 transition-colors hover:text-white/80"
            >
              {item}
            </a>
          ))}
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            ABOUT
          </p>
          {["Sustainability", "Journal", "Privacy Policy", "Terms of Service"].map((item) => (
            <a
              key={item}
              href="#"
              className="mb-2.5 block text-xs text-white/40 transition-colors hover:text-white/80"
            >
              {item}
            </a>
          ))}
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            FOLLOW
          </p>
          <div className="flex gap-4">
            {["Instagram", "Pinterest", "Vogue"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-white/40 transition-colors hover:text-white/80"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center">
        <p className="text-xs text-white/30">© 2024 Luna Soft. All rights reserved.</p>
      </div>
    </footer>
  )
}
