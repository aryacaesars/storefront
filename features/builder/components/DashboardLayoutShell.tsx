"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import EtalaseMark from "@/features/builder/landing/EtalaseMark"
import { DashboardHeader } from "@/features/builder/components/DashboardHeader"
import { DashboardHeaderProvider } from "@/features/builder/components/DashboardHeaderContext"
import { DashboardProviders } from "@/features/builder/components/DashboardProviders"
import { DashboardRouteTransition } from "@/features/builder/components/DashboardRouteTransition"
import { useMessages } from "@/features/i18n/LocaleProvider"

interface DashboardLayoutShellProps {
  children: ReactNode
  sidebar: ReactNode
  displayName?: string
  accountSubtitle?: string
  showProfile?: boolean
  sidebarBadge?: ReactNode
}

export function DashboardLayoutShell({
  children,
  sidebar,
  displayName,
  accountSubtitle = "Merchant",
  showProfile = true,
  sidebarBadge,
}: DashboardLayoutShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useMessages().dashboard

  return (
    <DashboardHeaderProvider>
      <div className="flex h-dvh overflow-hidden bg-dash-bg lg:gap-4 lg:p-4">
        {mobileOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-dash-ink/40 backdrop-blur-[2px] lg:hidden"
            aria-label={t.closeMenu}
            onClick={() => setMobileOpen(false)}
          />
        )}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-[272px] shrink-0 flex-col bg-dash-surface transition-transform duration-200 ease-out",
            "shadow-[0_4px_24px_-4px_rgba(15,23,42,0.12)]",
            mobileOpen ? "translate-x-0 rounded-r-[28px]" : "-translate-x-full",
            "lg:static lg:h-full lg:translate-x-0 lg:rounded-[28px] lg:border lg:border-dash-border/50 lg:shadow-[0_8px_16px_rgba(15,23,42,0.12)]",
          )}
        >
          <div className="flex items-center justify-between px-5 pb-2 pt-6">
            <Link href="/dashboard" className="transition-opacity hover:opacity-80">
              <EtalaseMark />
            </Link>
            {sidebarBadge}
          </div>

          <div
            className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            onClick={() => setMobileOpen(false)}
          >
            {sidebar}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <DashboardHeader
            displayName={displayName}
            subtitle={accountSubtitle}
            showProfile={showProfile}
            onMenuClick={() => setMobileOpen(true)}
          />

          <main className="min-h-0 w-full min-w-0 flex-1 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <DashboardProviders>
              <DashboardRouteTransition>{children}</DashboardRouteTransition>
            </DashboardProviders>
          </main>
        </div>
      </div>
    </DashboardHeaderProvider>
  )
}
