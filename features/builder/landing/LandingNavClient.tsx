"use client"

import Link from "next/link"
import { LandingNavLinks } from "@/features/builder/landing/LandingNavLinks"
import EtalaseMark from "@/features/builder/landing/EtalaseMark"
import { LocaleToggle } from "@/features/i18n/LocaleToggle"
import { useMessages } from "@/features/i18n/LocaleProvider"

interface LandingNavClientProps {
  showLinks?: boolean
  ctaHref: string
  ctaKind: "login" | "dashboard" | "admin"
}

export function LandingNavClient({
  showLinks = true,
  ctaHref,
  ctaKind,
}: LandingNavClientProps) {
  const t = useMessages()

  const links = [
    { label: t.nav.home, href: "/#home" },
    { label: t.nav.template, href: "/templates" },
    { label: t.nav.faq, href: "/#faq" },
  ]

  const ctaLabel =
    ctaKind === "admin"
      ? t.nav.admin
      : ctaKind === "dashboard"
        ? t.nav.dashboard
        : t.nav.login

  return (
    <header className="sticky top-4 z-50 w-full px-4">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 rounded-full border border-black/5 bg-white/80 pl-6 pr-2.5 shadow-lg shadow-slate-900/5 backdrop-blur">
        <Link href="/#home" aria-label={t.nav.homeAria}>
          <EtalaseMark />
        </Link>

        {showLinks && <LandingNavLinks links={links} />}

        <div className="flex shrink-0 items-center gap-2">
          <LocaleToggle />
          <Link
            href={ctaHref}
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            {ctaLabel}
          </Link>
        </div>
      </nav>
    </header>
  )
}
