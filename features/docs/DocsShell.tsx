"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Link from "next/link"
import { BookOpen, Menu, X } from "lucide-react"
import EtalaseMark from "@/features/builder/landing/EtalaseMark"
import { DocsSidebar } from "@/features/docs/DocsSidebar"
import { cn } from "@/lib/utils"

type DocsShellProps = {
  children: ReactNode
  activeSlug?: string
}

export function DocsShell({ children, activeSlug }: DocsShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-dvh overflow-hidden bg-dash-bg text-dash-ink">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-dash-ink/40 backdrop-blur-[2px] lg:hidden"
          aria-label="Tutup menu"
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
            aria-label="Tutup menu"
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
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-dash-border/80 bg-dash-surface px-4 sm:px-6">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-dash-border bg-white text-dash-ink lg:hidden"
            aria-label="Buka menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>

          <p className="hidden text-sm text-dash-muted lg:block">
            Panduan merchant Etalase
          </p>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              href="/support"
              className="hidden text-sm font-medium text-dash-muted transition-colors hover:text-dash-ink sm:inline"
            >
              Bantuan
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
            >
              Dashboard
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
