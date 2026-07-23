"use client"

import { Menu } from "lucide-react"
import { SidebarAccountMenu } from "@/features/builder/components/SidebarAccountMenu"
import { useDashboardHeaderTitle } from "@/features/builder/components/DashboardHeaderContext"
import { useMessages } from "@/features/i18n/LocaleProvider"

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
  const t = useMessages().dashboard

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 bg-transparent px-4 sm:h-16 sm:gap-3 sm:px-6 lg:px-8">
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-dash-border/70 bg-dash-surface text-dash-muted transition-colors duration-200 hover:border-dash-border hover:text-dash-ink sm:h-10 sm:w-10 lg:hidden"
          aria-label={t.openMenu}
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        </button>
      )}

      {title && (
        <h1
          title={title}
          className="min-w-0 flex-1 truncate font-display text-sm font-semibold leading-5 tracking-tight text-dash-ink sm:text-base sm:leading-6 lg:text-lg lg:leading-7"
        >
          {title}
        </h1>
      )}

      <div className={`flex shrink-0 items-center gap-1.5 sm:gap-2 ${title ? "" : "ml-auto"}`}>
        <div className="shrink-0 sm:w-[192px]">
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
