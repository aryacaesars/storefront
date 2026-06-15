import Link from "next/link"
import Image from "next/image"
import type { ThemeConfig } from "@/themes/engine/schema"

interface HeroSectionProps {
  config?: ThemeConfig
}

const TITLE_SIZE_CLASSES = {
  sm: "text-2xl @2xl:text-4xl @5xl:text-[2.75rem]",
  md: "text-3xl @2xl:text-5xl @5xl:text-[3.5rem]",
  lg: "text-4xl @2xl:text-6xl @5xl:text-[4.25rem]",
} as const

export function HeroSection({ config }: HeroSectionProps) {
  const heroImageUrl = config?.heroImageUrl
  const hero = config?.hero

  const title = hero?.title || "Quiet Luxury for the Modern Individual"
  const subtitle =
    hero?.subtitle ||
    "Curated essentials designed with intention — timeless silhouettes, conscious materials, and enduring craft."
  const ctaLabel = hero?.ctaLabel || "Shop Collection"
  const ctaHref = hero?.ctaHref || "/products"
  const align = hero?.align ?? "center"
  const tone = hero?.textTone ?? "dark"
  const titleSize = hero?.titleSize ?? "md"

  const isCenter = align === "center"
  const isLight = tone === "light"

  return (
    <section className="relative overflow-hidden">
      <div className="relative aspect-[16/7] min-h-[320px] w-full bg-gradient-to-br from-stone-200 via-amber-50 to-stone-300 @2xl:min-h-[440px]">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.65),transparent_55%)]" />
        )}

        {/* Overlay mengikuti tone supaya kontras teks selalu terjaga. */}
        {isLight ? (
          <div
            className={
              isCenter
                ? "absolute inset-0 bg-black/35"
                : "absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent"
            }
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        )}

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6">
            <div
              className={
                isCenter ? "mx-auto max-w-2xl text-center" : "max-w-lg text-left"
              }
            >
              <h1
                className={`font-semibold leading-[1.15] tracking-tight ${TITLE_SIZE_CLASSES[titleSize]} ${
                  isLight ? "text-white" : "text-[var(--theme-text)]"
                }`}
                style={{ fontFamily: "var(--theme-heading-font)" }}
              >
                {title}
              </h1>
              <p
                className={`mt-4 max-w-md text-sm leading-relaxed @2xl:text-base ${
                  isCenter ? "mx-auto" : ""
                } ${isLight ? "text-white/85" : "text-[var(--theme-muted)]"}`}
              >
                {subtitle}
              </p>
              <Link
                href={ctaHref}
                className="mt-8 inline-flex h-11 rounded-full items-center px-8 text-xs font-bold tracking-[0.14em] text-white uppercase transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--theme-primary)" }}
              >
                {ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
