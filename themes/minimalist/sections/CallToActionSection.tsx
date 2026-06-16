import Link from "next/link"
import { getStringSetting } from "@/themes/engine/section-settings-schema"
import type { SectionProps } from "@/themes/engine/section-registry"

export function CallToActionSection({ settings }: SectionProps) {
  const title = getStringSetting(settings, "title", "Experience the Art of Less")
  const primaryLabel = getStringSetting(settings, "primaryLabel", "Explore Collections")
  const secondaryLabel = getStringSetting(settings, "secondaryLabel", "Read the Journal")

  return (
    <section
      className="px-6 py-24 text-center"
      style={{ backgroundColor: "var(--theme-primary)" }}
    >
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {title}
        </h2>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex h-11 items-center border border-white px-8 text-xs font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-white hover:text-[var(--theme-primary)]"
          >
            {primaryLabel}
          </Link>
          <Link
            href="/about"
            className="inline-flex h-11 items-center px-8 text-xs font-bold tracking-[0.14em] text-white/80 uppercase transition-colors hover:text-white"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
