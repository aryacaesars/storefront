import { Share2, Globe } from "lucide-react"
import type { ThemeConfig } from "@/themes/engine/schema"

interface AboutFooterProps {
  config: ThemeConfig
}

export function AboutFooter({ config }: AboutFooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl">
        {/* Main grid */}
        <div className="grid gap-8 px-6 py-12 md:grid-cols-5">
          {/* Brand */}
          <div>
            <p
              className="text-sm font-black uppercase"
              style={{ fontFamily: "var(--theme-heading-font)", color: "var(--theme-primary)" }}
            >
              {config.storeName}
            </p>
            <p className="mt-3 max-w-[200px] text-xs leading-relaxed text-zinc-400">
              Precision engineered for those who refuse to stop. Our mission is to provide the gear
              that keeps you moving forward.
            </p>
          </div>

          {/* Resources */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
              RESOURCES
            </p>
            <ul className="space-y-2.5">
              {["Our Story", "Sustainability"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
              SUPPORT
            </p>
            <ul className="space-y-2.5">
              {["Contact Support", "Shipping & Returns"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
              LEGAL
            </p>
            <ul className="space-y-2.5">
              {["Privacy Policy", "Terms of Service"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
              SOCIAL
            </p>
            <div className="flex gap-3">
              <Share2
                className="h-4 w-4 cursor-pointer text-zinc-400 transition-colors"
                strokeWidth={1.5}
              />
              <Globe
                className="h-4 w-4 cursor-pointer text-zinc-400 transition-colors"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-5">
          <p className="text-xs text-zinc-400">
            © 2024 {config.storeName.toUpperCase()}. PRECISION ENGINEERED.
          </p>
          <div className="h-5 w-5 rounded-sm border border-gray-200 bg-gray-50" />
        </div>
      </div>
    </footer>
  )
}
