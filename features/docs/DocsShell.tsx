"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Menu, X } from "lucide-react"
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
    <div className="flex h-dvh overflow-hidden bg-white text-dash-ink lg:gap-4 lg:p-4">
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
          "lg:static lg:h-full lg:translate-x-0 lg:rounded-[28px] lg:border lg:border-dash-border/50 lg:shadow-[0_8px_16px_rgba(15,23,42,0.12)]",
        )}
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-6">
          <Link href="/docs" className="transition-opacity hover:opacity-80">
            <span className="inline-flex items-center gap-2">
              <EtalaseMark />
              <span className="hidden h-4 w-px bg-dash-border sm:block" />
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-dash-muted">
                <BookOpen className="h-3.5 w-3.5" />
                Docs
              </span>
            </span>
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

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 bg-transparent px-4 sm:h-16 sm:gap-3 sm:px-6 lg:px-8">
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-dash-border/70 bg-dash-surface text-dash-muted transition-colors duration-200 hover:border-dash-border hover:text-dash-ink sm:h-10 sm:w-10 lg:hidden"
            aria-label={t.dashboard.openMenu}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          </button>

          <Link
            href="/"
            aria-label={t.docs.back}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-dash-border/70 bg-dash-surface text-dash-muted transition-colors duration-200 hover:border-dash-border hover:text-dash-ink sm:h-10 sm:w-10"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          </Link>

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
