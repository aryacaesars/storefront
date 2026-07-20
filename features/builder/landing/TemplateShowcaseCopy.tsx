"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import AnimatedBlurFadeIn from "@/features/builder/landing/AnimatedBlurFadeIn"
import { useMessages } from "@/features/i18n/LocaleProvider"

export function TemplateShowcaseHeading() {
  const t = useMessages()
  return (
    <AnimatedBlurFadeIn
      as="h2"
      className="mx-auto max-w-3xl text-center font-display text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl"
      delayMs={120}
    >
      {t.templates.titleBefore}
      <br />
      {t.templates.titleAfter} <span className="text-brand">{t.templates.titleBrand}</span>
    </AnimatedBlurFadeIn>
  )
}

export function ExploreMoreCard() {
  const t = useMessages()
  return (
    <Link
      href="/templates"
      className="group flex min-h-[280px] flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl bg-brand p-8 text-center transition-colors hover:bg-brand-dark sm:min-h-0"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition-transform duration-300 group-hover:scale-110">
        <ArrowUpRight className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <div>
        <p className="font-display text-xl font-bold text-white">{t.templates.exploreTitle}</p>
        <p className="mt-1 text-sm text-white/70">{t.templates.exploreSubtitle}</p>
      </div>
    </Link>
  )
}
