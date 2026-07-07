import { X, Share2, Mail } from "lucide-react"
import type { ThemeConfig } from "@/themes/engine/schema"

interface FooterProps {
  config: ThemeConfig
}

export function Footer({ config }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2">
        {/* Brand */}
        <div>
          <p className="font-black uppercase text-white" style={{ fontFamily: "var(--theme-heading-font)" }}>
            {config.storeName}
          </p>
          <p className="mt-3 text-sm text-white/40">{config.tagline}</p>
          <div className="mt-5 flex gap-4">
            <span className="text-white/40">
              <X className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <span className="text-white/40">
              <Share2 className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <span className="text-white/40">
              <Mail className="h-4 w-4" strokeWidth={1.5} />
            </span>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">NEWSLETTER</p>
          <p className="mt-4 text-sm text-white/40">Access early release drops and technical insights.</p>
          <form className="mt-4 flex">
            <input
              type="email"
              placeholder="Email address"
              className="h-10 flex-1 border border-r-0 border-white/20 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/40"
            />
            <button
              type="submit"
              className="px-4 text-xs font-black uppercase tracking-[0.1em] text-zinc-900 transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--theme-accent)" }}
            >
              JOIN
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="text-center text-xs text-white/30">
          © 2026 {config.storeName}. Precision Engineering.
        </p>
      </div>
    </footer>
  )
}
