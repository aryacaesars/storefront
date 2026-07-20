"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import AnimatedBlurFadeIn from "@/features/builder/landing/AnimatedBlurFadeIn"
import { useMessages } from "@/features/i18n/LocaleProvider"

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string
  answer: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="py-5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-start justify-between gap-4 text-left"
      >
        <span className="min-w-0 flex-1 text-base font-semibold leading-snug text-ink sm:text-lg">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ease-out",
            open && "rotate-180 text-brand",
          )}
          strokeWidth={2}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p
            className={cn(
              "max-w-2xl pt-3 pr-8 text-sm leading-relaxed text-slate-600 transition-opacity duration-300 ease-out sm:text-base",
              open ? "opacity-100" : "opacity-0",
            )}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FaqSection() {
  const t = useMessages()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const faqs = t.faq.items

  return (
    <section id="faq" className="relative scroll-mt-28 overflow-hidden bg-white px-6 py-24">
      <div className="relative mx-auto max-w-3xl">
        <AnimatedBlurFadeIn
          as="h2"
          className="text-center font-display text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl"
          delayMs={80}
        >
          {t.faq.titleBefore} <span className="text-brand">{t.faq.titleBrand}</span>
        </AnimatedBlurFadeIn>

        <AnimatedBlurFadeIn as="div" className="mt-4 text-center" delayMs={160}>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-slate-600">
            {t.faq.subtitle}
          </p>
        </AnimatedBlurFadeIn>

        <AnimatedBlurFadeIn as="div" className="mt-12" delayMs={220}>
          <div className="divide-y divide-black/5 border-y border-black/5">
            {faqs.map((item, index) => (
              <FaqItem
                key={item.q}
                question={item.q}
                answer={item.a}
                open={openIndex === index}
                onToggle={() =>
                  setOpenIndex((current) => (current === index ? null : index))
                }
              />
            ))}
          </div>
        </AnimatedBlurFadeIn>

        <AnimatedBlurFadeIn as="div" className="mt-12 flex justify-center" delayMs={300}>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-dark"
          >
            {t.faq.docsCta}
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
          </Link>
        </AnimatedBlurFadeIn>
      </div>
    </section>
  )
}
