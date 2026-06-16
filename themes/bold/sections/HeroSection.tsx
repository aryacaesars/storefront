import Image from "next/image"
import Link from "next/link"
import type { ThemeConfig } from "@/themes/engine/schema"

interface HeroSectionProps {
  config?: ThemeConfig
}

const TITLE_SIZE_CLASSES = {
  sm: "text-4xl md:text-5xl",
  md: "text-5xl md:text-7xl",
  lg: "text-6xl md:text-[5.5rem]",
} as const

export function HeroSection({ config }: HeroSectionProps) {
  const hero = config?.hero
  const heroImageUrl = config?.heroImageUrl

  const title = hero?.title ?? "DEFINING THE LIMIT OF HUMAN POTENTIAL."
  const subtitle =
    hero?.subtitle ??
    "Momentum Bold isn't just gear. It's a commitment to the engineering of motion and the relentless pursuit of peak performance."
  const ctaLabel = hero?.ctaLabel ?? "SHOP ELITE GEAR"
  const ctaHref = hero?.ctaHref ?? "/products"
  const align = hero?.align ?? "left"
  const titleSize = hero?.titleSize ?? "md"

  const isCenter = align === "center"

  return (
    <section
      id="section-hero"
      className="relative min-h-[100svh] overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#0D4A3E]"
    >
      {heroImageUrl ? (
        <>
          <Image
            src={heroImageUrl}
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        </>
      ) : (
        <>
          <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-[#0D4A3E]/30 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-transparent" />
        </>
      )}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
        aria-hidden="true"
      >
        <span
          className="font-black uppercase text-white/[0.03]"
          style={{
            fontSize: "clamp(140px, 22vw, 320px)",
            fontFamily: "var(--theme-heading-font)",
            lineHeight: 0.85,
            letterSpacing: "-0.02em",
          }}
        >
          BOLD
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black/65 to-transparent" />

      <div
        className="pointer-events-none absolute left-0 top-0 hidden h-full w-1 md:block"
        style={{ backgroundColor: "var(--theme-accent)" }}
      />

      <div
        className={`relative z-20 flex min-h-[100svh] items-end ${
          isCenter ? "justify-center" : "justify-start"
        }`}
      >
        <div
          className={`w-full max-w-7xl px-6 pb-20 pt-32 md:px-10 md:pb-24 ${
            isCenter ? "text-center" : "text-left"
          }`}
        >
          <div className={isCenter ? "mx-auto max-w-3xl" : "max-w-2xl"}>
            <div
              className={`flex items-center gap-3 ${isCenter ? "justify-center" : ""}`}
            >
              <span
                className="h-px w-8"
                style={{ backgroundColor: "var(--theme-accent)" }}
              />
              <span
                className="text-[10px] font-black uppercase tracking-[0.28em]"
                style={{ color: "var(--theme-accent)" }}
              >
                {config?.storeName ?? "MOMENTUM BOLD"}
              </span>
            </div>

            <h1
              className={`mt-6 font-black uppercase leading-[0.92] text-white ${TITLE_SIZE_CLASSES[titleSize]}`}
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              {title}
            </h1>

            <p
              className={`mt-5 max-w-lg text-sm leading-relaxed text-white/65 md:text-base ${
                isCenter ? "mx-auto" : ""
              }`}
            >
              {subtitle}
            </p>

            <div
              className={`mt-9 flex flex-wrap gap-3 ${isCenter ? "justify-center" : ""}`}
            >
              <Link
                href={ctaHref}
                className="inline-flex h-11 items-center px-7 text-xs font-black uppercase tracking-[0.12em] text-zinc-900 transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--theme-accent)" }}
              >
                {ctaLabel}
              </Link>
              <Link
                href="/about"
                className="inline-flex h-11 items-center border border-white/40 px-7 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-white"
              >
                OUR STORY
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`pointer-events-none absolute bottom-8 z-20 hidden flex-col items-center gap-2 md:flex ${
          isCenter ? "left-1/2 -translate-x-1/2" : "right-10"
        }`}
        aria-hidden="true"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-white/35 [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span
          className="h-12 w-px bg-gradient-to-b from-white/50 to-transparent"
        />
      </div>
    </section>
  )
}
