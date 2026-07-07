"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { HelpCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import EtalaseMark from "@/features/builder/landing/EtalaseMark"
import { DashboardHeader } from "@/features/builder/components/DashboardHeader"
import { DashboardProviders } from "@/features/builder/components/DashboardProviders"

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
    <div className="flex h-screen overflow-hidden bg-dash-bg">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[290px] shrink-0 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <EtalaseMark />
          {sidebarBadge}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6" onClick={() => setMobileOpen(false)}>
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menu
          </p>
          {sidebar}
        </div>

        <div className="border-t border-gray-100 px-4 py-4">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <HelpCircle className="h-5 w-5 shrink-0" />
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

        <main className="min-h-0 flex-1 overflow-auto">
          <DashboardProviders>{children}</DashboardProviders>
        </main>
      </div>
    </div>
  )
}
