import { Globe, Heart, Share2 } from "lucide-react"

export function AboutFooter() {
  return (
    <footer className="border-t border-white/10 bg-[var(--theme-text)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-6 pt-12 md:grid-cols-4">
        <div>
          <p
            className="mb-3 text-2xl font-medium text-white"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            Luna Soft
          </p>
          <p className="max-w-[190px] text-xs leading-relaxed text-white/40">
            Curating a life of quiet luxury and intentional design since 2024.
          </p>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            EXPLORE
          </p>
          {["Shop All", "New Arrivals", "Collections", "Sustainability"].map((item) => (
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
            SUPPORT
          </p>
          {["Shipping & Returns", "Privacy Policy", "Terms of Service", "Contact"].map((item) => (
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
            SOCIAL
          </p>
          {["Instagram", "Pinterest", "Journal"].map((item) => (
            <a
              key={item}
              href="#"
              className="mb-2.5 block text-xs text-white/40 transition-colors hover:text-white/80"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 mt-10 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <p className="text-[10px] text-white/30">© 2024 Luna Soft. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Globe  className="h-3.5 w-3.5 text-white/25" />
            <Heart  className="h-3.5 w-3.5 text-white/25" />
            <Share2 className="h-3.5 w-3.5 text-white/25" />
          </div>
        </div>
      </div>
    </footer>
  )
}
