"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { LandingNavLinks } from "@/features/builder/landing/LandingNavLinks"
import EtalaseMark from "@/features/builder/landing/EtalaseMark"
import { LocaleToggle } from "@/features/i18n/LocaleToggle"
import { useMessages } from "@/features/i18n/LocaleProvider"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface LandingNavClientProps {
  showLinks?: boolean
  ctaHref: string
  ctaKind: "login" | "dashboard" | "admin"
}

function parseHash(href: string): string | null {
  const hashIndex = href.indexOf("#")
  if (hashIndex < 0) return null
  const hash = href.slice(hashIndex + 1)
  return hash || null
}

function smoothScrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior: "smooth", block: "start" })
  return true
}

export function LandingNavClient({
  showLinks = true,
  ctaHref,
  ctaKind,
}: LandingNavClientProps) {
  const t = useMessages()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

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

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [menuOpen])

  function onMobileNavClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    const hash = parseHash(href)
    const isLandingHash =
      hash !== null && (href.startsWith("/#") || href.startsWith("#"))
    if (!isLandingHash || !hash) {
      setMenuOpen(false)
      return
    }
    if (pathname === "/") {
      event.preventDefault()
      if (hash === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" })
        window.history.pushState(null, "", "/#home")
      } else if (smoothScrollToId(hash)) {
        window.history.pushState(null, "", `/#${hash}`)
      }
      setMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-4 z-50 w-full px-4">
      <nav className="relative mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 rounded-full border border-black/5 bg-white/80 pl-6 pr-2.5 shadow-lg shadow-slate-900/5 backdrop-blur">
        <Link href="/#home" aria-label={t.nav.homeAria} className="shrink-0">
          <EtalaseMark />
        </Link>

        {showLinks && <LandingNavLinks links={links} />}

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Desktop: flags beside CTA */}
          <div className="hidden md:block">
            <LocaleToggle />
          </div>

          <Link
            href={ctaHref}
            className="rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark sm:px-5"
          >
            {ctaLabel}
          </Link>

          {/* Mobile: burger with links + flags */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-ink transition-colors hover:bg-slate-50 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" strokeWidth={1.75} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-black/20 md:hidden"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="landing-mobile-menu"
            className="absolute top-[calc(100%+0.5rem)] right-4 left-4 z-50 overflow-hidden rounded-2xl border border-black/5 bg-white p-3 shadow-xl shadow-slate-900/10 md:hidden"
          >
            {showLinks && (
              <ul className="flex flex-col gap-0.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-ink"
                      onClick={(event) => onMobileNavClick(event, link.href)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div
              className={cn(
                "flex items-center justify-between gap-3 px-3 py-3",
                showLinks && "mt-1 border-t border-black/5",
              )}
            >
              <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                {t.locale.label}
              </span>
              <LocaleToggle compact />
            </div>
          </div>
        </>
      )}
    </header>
  )
}
