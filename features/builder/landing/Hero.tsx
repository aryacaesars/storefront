"use client"

import Image from "next/image"
import laptopMock from "@/public/builder-landing/laptop-mock.png"
import gradient from "@/public/builder-landing/gradient.png"
import AnimatedBlurFadeIn from "@/features/builder/landing/AnimatedBlurFadeIn"
import { useMessages } from "@/features/i18n/LocaleProvider"

export default function Hero() {
  const t = useMessages()

  return (
    <section
      id="home"
      className="relative scroll-mt-28 overflow-hidden bg-white px-6 pt-16 pb-24"
    >
      <Image
        src={gradient}
        alt=""
        aria-hidden
        priority
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[80%] w-[150%] max-w-none -translate-x-1/2 -translate-y-1/3 opacity-80 blur-2xl"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <AnimatedBlurFadeIn
          as="h1"
          className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl"
          delayMs={80}
        >
          {t.hero.line1Before} <span className="text-brand">{t.hero.line1Brand}</span>
          <br />
          {t.hero.line2}
        </AnimatedBlurFadeIn>

        <AnimatedBlurFadeIn as="div" className="mt-8" delayMs={220}>
          <a
            href="/register"
            className="inline-block rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-colors hover:bg-brand-dark"
          >
            {t.hero.cta}
          </a>
        </AnimatedBlurFadeIn>
      </div>

      <div className="relative z-10 mx-auto mt-14 max-w-4xl">
        <Image
          src={laptopMock}
          alt={t.hero.previewAlt}
          priority
          className="relative mx-auto h-auto w-full"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 58%, rgba(0,0,0,0.35) 76%, transparent 92%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 58%, rgba(0,0,0,0.35) 76%, transparent 92%)",
          }}
        />
      </div>
    </section>
  )
}
