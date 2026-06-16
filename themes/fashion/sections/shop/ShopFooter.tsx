import type { ThemeConfig } from "@/themes/engine/schema"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"

interface ShopFooterProps {
  config?: ThemeConfig
}

export function ShopFooter({ config = DEFAULT_FASHION_CONFIG }: ShopFooterProps) {
  return (
    <footer style={{ backgroundColor: "var(--theme-text)" }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <p
            className="mb-4 text-2xl font-medium text-white"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {config.storeName}
          </p>
          <p className="max-w-[200px] text-xs leading-relaxed text-white/40">
            {config.tagline ?? "Redefining modern luxury through sustainable materials."}
          </p>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            SHOP
          </p>
          {["New Arrivals", "Best Sellers", "Collections", "Accessories"].map((item) => (
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
            COMPANY
          </p>
          {["Sustainability", "Journal", "Our Story", "Privacy Policy"].map((item) => (
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
            NEWSLETTER
          </p>
          <p className="mt-3 text-xs leading-relaxed text-white/40">
            Sign up for exclusive updates and seasonal releases.
          </p>
          <div className="mt-4 flex border-b border-white/20">
            <input
              type="email"
              placeholder="Email Address"
              className="flex-1 bg-transparent py-2 text-xs text-white outline-none placeholder:text-white/30"
            />
            <button
              type="submit"
              className="px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60 transition-colors hover:text-white"
            >
              JOIN
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center">
        <p className="text-xs text-white/30">© 2024 Luna Soft. All rights reserved.</p>
      </div>
    </footer>
  )
}
