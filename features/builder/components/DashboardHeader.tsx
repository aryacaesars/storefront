"use client"

import { Bell, Menu } from "lucide-react"
import { SidebarAccountMenu } from "@/features/builder/components/SidebarAccountMenu"

interface DashboardHeaderProps {
  displayName?: string
  subtitle?: string
  showProfile?: boolean
  onMenuClick?: () => void
}

export function DashboardHeader({
  displayName = "Account",
  subtitle = "Merchant",
  showProfile = true,
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-dash-border bg-dash-surface/95 px-4 backdrop-blur-sm lg:px-6">
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dash-border text-dash-muted transition-colors duration-200 hover:bg-dash-bg hover:text-dash-ink lg:hidden"
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        </button>
      )}

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-dash-border text-dash-muted transition-colors duration-200 hover:bg-dash-bg hover:text-dash-ink"
          aria-label="Notifikasi"
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-dash-primary" />
        </button>

        <div className="w-44 sm:w-48">
          <SidebarAccountMenu
            displayName={displayName}
            subtitle={subtitle}
            showProfile={showProfile}
            variant="header"
          />
        </div>
      </div>
    </header>
  )
}
