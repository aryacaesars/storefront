import Link from "next/link"
import type { ThemeConfig } from "@/themes/engine/schema"

interface HeroSectionProps {
  config: ThemeConfig
}

export function HeroSection({ config }: HeroSectionProps) {
  return (
    <>
      {config.bannerText && (
        <div
          className="text-center text-[11px] tracking-wide text-white py-2.5 px-4"
          style={{ backgroundColor: "var(--theme-primary)" }}
        >
          {config.bannerText}
        </div>
      )}

      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-stone-300 via-amber-100 to-stone-400">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="pb-16 px-10 max-w-lg">
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/70 mb-4">
              NEW SEASON ARRIVAL
            </p>
            <h1
              className="text-5xl md:text-6xl font-normal leading-[1.1] text-white"
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              Curated For Everyday Beauty
            </h1>
            <Link
              href="#"
              className="mt-6 inline-flex h-10 items-center border border-white px-7 text-[10px] tracking-[0.2em] uppercase text-white transition-colors hover:bg-white hover:text-[var(--theme-text)]"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
