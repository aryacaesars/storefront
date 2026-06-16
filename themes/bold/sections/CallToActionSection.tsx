import { getStringSetting } from "@/themes/engine/section-settings-schema"
import type { SectionProps } from "@/themes/engine/section-registry"

export function CallToActionSection({ settings }: SectionProps) {
  const title = getStringSetting(settings, "title", "BECOME PART OF THE MOMENTUM.")
  const subtitle = getStringSetting(
    settings,
    "subtitle",
    "Join the elite circle of athletes and innovators redefining the boundaries of the possible.",
  )

  return (
    <section className="bg-zinc-950 px-6 py-28 text-center">
      <h2
        className="text-4xl font-black uppercase leading-tight text-white md:text-6xl"
        style={{ fontFamily: "var(--theme-heading-font)" }}
      >
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-sm text-white/50">{subtitle}</p>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/products"
          className="inline-flex h-12 items-center px-10 text-xs font-black uppercase tracking-[0.15em] text-zinc-900 transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--theme-accent)" }}
        >
          SHOP THE SERIES
        </a>
        <a
          href="/about"
          className="inline-flex h-12 items-center border border-white/30 px-10 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:border-white"
        >
          OUR STORY
        </a>
      </div>
    </section>
  )
}
