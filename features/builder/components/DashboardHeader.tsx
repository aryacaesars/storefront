"use client"

import { Bell, Menu } from "lucide-react"
import { SidebarAccountMenu } from "@/features/builder/components/SidebarAccountMenu"
import { useDashboardHeaderTitle } from "@/features/builder/components/DashboardHeaderContext"

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
  const { title } = useDashboardHeaderTitle()

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 bg-transparent px-6 lg:px-8">
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dash-border/70 bg-dash-surface text-dash-muted transition-colors duration-200 hover:border-dash-border hover:text-dash-ink lg:hidden"
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        </button>
      )}

      {title && (
        <h1 className="min-w-0 flex-1 truncate font-display text-[1.75rem] font-bold leading-9 tracking-tight text-dash-ink lg:text-[1.875rem]">
          {title}
        </h1>
      )}

      <div className={`flex shrink-0 items-center gap-2 ${title ? "" : "ml-auto"}`}>
        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-dash-border/70 bg-dash-surface text-dash-muted transition-colors duration-200 hover:border-dash-border hover:text-dash-ink"
          aria-label="Notifikasi"
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-dash-primary" />
        </button>

        <div className="w-[168px] sm:w-[192px]">
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
