"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { HelpCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import EtalaseMark from "@/features/builder/landing/EtalaseMark"
import { DashboardHeader } from "@/features/builder/components/DashboardHeader"
import { DashboardProviders } from "@/features/builder/components/DashboardProviders"
import { dashboardSectionTitle } from "@/features/builder/components/dashboard-ui"

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

  return (
    <div className="flex h-dvh overflow-hidden bg-dash-bg">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-dash-ink/40 backdrop-blur-[2px] lg:hidden"
          aria-label="Tutup menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[252px] shrink-0 flex-col border-r border-dash-border bg-dash-surface transition-transform duration-200 ease-out xl:w-[260px] lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-dash-border/80 px-5 py-5">
          <EtalaseMark />
          {sidebarBadge}
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5" onClick={() => setMobileOpen(false)}>
          <p className={cn(dashboardSectionTitle, "mb-2 px-3")}>Menu</p>
          {sidebar}
        </div>

        <div className="border-t border-dash-border/80 px-3 py-4">
          <Link
            href="/support"
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-dash-muted transition-colors duration-200 hover:bg-dash-bg hover:text-dash-ink"
          >
            <HelpCircle className="h-5 w-5 shrink-0" strokeWidth={1.75} />
            Support
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader
          displayName={displayName}
          subtitle={accountSubtitle}
          showProfile={showProfile}
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="min-h-0 w-full min-w-0 flex-1 overflow-auto">
          <DashboardProviders>{children}</DashboardProviders>
        </main>
      </div>
    </div>
  )
}
