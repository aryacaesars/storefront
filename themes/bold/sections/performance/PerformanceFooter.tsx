import { X, Share2, Mail } from "lucide-react"
import type { ThemeConfig } from "@/themes/engine/schema"

interface PerformanceFooterProps {
  config: ThemeConfig
}

export function PerformanceFooter({ config }: PerformanceFooterProps) {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto px-6 py-14 max-w-7xl">
        <div>
          <p
            className="font-black uppercase text-white"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {config.storeName}.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-white/40">
            Precision engineered performance apparel for the dedicated athlete. Designed for
            movement, built for results.
          </p>
          <div className="mt-5 flex gap-3">
            <span className="text-white/40" aria-label="X">
              <X className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <span className="text-white/40" aria-label="Share">
              <Share2 className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <span className="text-white/40" aria-label="Email">
              <Mail className="h-4 w-4" strokeWidth={1.5} />
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <p className="text-xs text-white/30">
            © 2026 {config.storeName.toUpperCase()}. PRECISION ENGINEERED.
          </p>
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-6 w-6 rounded-sm border border-white/10 bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
