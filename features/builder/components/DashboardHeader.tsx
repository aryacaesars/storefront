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
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-dash-primary" />
        </button>

        <div className="w-44">
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
