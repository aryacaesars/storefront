import { Globe, Share2, Bell } from "lucide-react"
import type { ThemeConfig } from "@/themes/engine/schema"

interface TechSeriesFooterProps {
  config: ThemeConfig
}

export function TechSeriesFooter({ config }: TechSeriesFooterProps) {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 px-6 py-14 md:grid-cols-2">
          {/* Brand */}
          <div>
            <p
              className="text-sm font-black uppercase"
              style={{ fontFamily: "var(--theme-heading-font)", color: "var(--theme-accent)" }}
            >
              {config.storeName}
            </p>
            <p className="mt-3 max-w-[200px] text-xs leading-relaxed text-white/40">
              Engineered for those who refuse to stand still. Precision tools for elite performance
              and technical excellence.
            </p>
            <div className="mt-5 flex gap-3">
              <Globe className="h-4 w-4 text-white/40" strokeWidth={1.5} />
              <Share2 className="h-4 w-4 text-white/40" strokeWidth={1.5} />
              <Bell className="h-4 w-4 text-white/40" strokeWidth={1.5} />
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">NEWSLETTER</p>
            <p className="text-xs text-white/40">Get performance updates and early access.</p>
            <form className="mt-3 flex">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="h-10 flex-1 border border-white/20 bg-white/5 px-3 text-xs uppercase text-white outline-none placeholder:text-white/30"
              />
              <button
                type="submit"
                className="h-10 shrink-0 px-4 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-900 transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--theme-accent)" }}
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-6 py-5">
          <p className="text-xs text-white/30">© 2024 MOMENTUM BOLD. PRECISION ENGINEERED.</p>
        </div>
      </div>
    </footer>
  )
}
