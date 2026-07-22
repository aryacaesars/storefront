"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Menu, X } from "lucide-react"
import EtalaseMark from "@/features/builder/landing/EtalaseMark"
import { DocsSidebar } from "@/features/docs/DocsSidebar"
import { LocaleToggle } from "@/features/i18n/LocaleToggle"
import { useMessages } from "@/features/i18n/LocaleProvider"
import { cn } from "@/lib/utils"

type DocsShellProps = {
  children: ReactNode
  activeSlug?: string
}

export function DocsShell({ children, activeSlug }: DocsShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useMessages()

  return (
    <div className="flex h-dvh overflow-hidden bg-dash-bg text-dash-ink">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-dash-ink/40 backdrop-blur-[2px] lg:hidden"
          aria-label={t.dashboard.closeMenu}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — flush left, full height (gaya dashboard tenant) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[272px] shrink-0 flex-col bg-dash-surface transition-transform duration-200 ease-out",
          "shadow-[0_4px_24px_-4px_rgba(15,23,42,0.12)]",
          mobileOpen ? "translate-x-0 rounded-r-[28px]" : "-translate-x-full",
          "lg:static lg:h-full lg:translate-x-0 lg:rounded-none lg:border-r lg:border-dash-border/80 lg:shadow-none",
        )}
      >
        <div className="flex items-center justify-between py-2 pl-16 pr-5 pt-6">
          <Link href="/" className="cursor-pointer transition-opacity hover:opacity-80">
            <EtalaseMark />
          </Link>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-dash-muted hover:bg-dash-bg hover:text-dash-ink lg:hidden"
            aria-label={t.dashboard.closeMenu}
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <DocsSidebar
          activeSlug={activeSlug}
          className="min-h-0 flex-1"
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      <Link
        href="/"
        aria-label={t.docs.back}
        className="fixed top-4 left-6 z-50 p-2.5 bg-white shadow-md border border-gray-100 hover:scale-105 transition-all text-gray-700 rounded-full"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-dash-border/80 bg-dash-surface px-4 sm:px-6">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-dash-border bg-white text-dash-ink lg:hidden"
            aria-label={t.dashboard.openMenu}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>

          <p className="hidden text-sm text-dash-muted lg:block">
            {t.docs.headerSubtitle}
          </p>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <LocaleToggle />
            <Link
              href="/support"
              className="hidden text-sm font-medium text-dash-muted transition-colors hover:text-dash-ink sm:inline"
            >
              {t.dashboard.support}
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
            >
              {t.nav.dashboard}
            </Link>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  )
}
