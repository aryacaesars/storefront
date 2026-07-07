import { Globe, Share2, Bell } from "lucide-react"
import type { ThemeConfig } from "@/themes/engine/schema"

interface NewArrivalsFooterProps {
  config: ThemeConfig
}

export function NewArrivalsFooter({ config }: NewArrivalsFooterProps) {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        <div className="px-6 py-14">
          <div>
            <p
              className="text-sm font-black uppercase"
              style={{ fontFamily: "var(--theme-heading-font)", color: "var(--theme-accent)" }}
            >
              {config.storeName}
            </p>
            <p className="mt-3 max-w-[180px] text-xs leading-relaxed text-white/40">
              Precision engineered performance apparel for the elite. Built for the future.
            </p>
            <div className="mt-5 flex gap-3">
              <Globe className="h-4 w-4 text-white/40" strokeWidth={1.5} />
              <Share2 className="h-4 w-4 text-white/40" strokeWidth={1.5} />
              <Bell className="h-4 w-4 text-white/40" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-6 py-5">
          <p className="text-xs text-white/30">
            © 2024 {config.storeName.toUpperCase()}. PRECISION ENGINEERED.
          </p>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-6 w-6 rounded-sm border border-white/10 bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
