import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function getDashboardDisplayName(name: string | null | undefined): string {
  return name?.split(" ")[0] ?? "User"
}

export const dashboardCard =
  "rounded-2xl border border-dash-border bg-dash-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)]"

export const dashboardCardHover =
  "transition-all duration-200 hover:border-dash-primary/20 hover:shadow-[0_4px_20px_-8px_rgba(91,78,230,0.18)]"

export const dashboardBtnPrimary =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-dash-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-dash-primary-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dash-primary/40 focus-visible:ring-offset-2"

export const dashboardBtnOutline =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dash-border bg-dash-surface px-4 py-2.5 text-sm font-medium text-dash-ink transition-all duration-200 hover:border-dash-primary/25 hover:bg-dash-primary-light/50 hover:text-dash-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dash-primary/30 focus-visible:ring-offset-2"

export const dashboardLink =
  "cursor-pointer text-sm font-medium text-dash-primary transition-colors duration-200 hover:text-dash-primary-dark"

export const dashboardBackLink =
  "cursor-pointer text-sm text-dash-muted transition-colors duration-200 hover:text-dash-primary"

export const dashboardInput =
  "w-full rounded-xl border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm text-dash-ink transition-colors duration-200 placeholder:text-dash-muted/70 focus:border-dash-primary focus:outline-none focus:ring-2 focus:ring-dash-primary/15"

export const dashboardFormWidth = "w-full max-w-2xl"

export const dashboardLabel = "mb-1.5 block text-sm font-medium text-dash-ink"

export const dashboardTableHeadRow = "border-b border-dash-border bg-dash-bg/60"
export const dashboardTableHeadCell =
  "px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-dash-muted"

export const dashboardSectionTitle = "text-xs font-semibold uppercase tracking-wider text-dash-muted"

/** Padding konsisten seluruh halaman dashboard — full width area konten */
export const dashboardPage = "w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"

/** Grid 12-kolom untuk layout bento proporsional */
export const dashboardGrid = "grid grid-cols-12 gap-4 lg:gap-6"

interface DashboardPanelProps {
  children: ReactNode
  className?: string
  title?: string
  action?: ReactNode
}

export function DashboardPanel({ children, className, title, action }: DashboardPanelProps) {
  return (
    <div className={cn(dashboardCard, "flex flex-col overflow-hidden", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-dash-border/80 px-4 py-3.5 sm:px-5">
          {title && <h2 className="text-sm font-semibold text-dash-ink">{title}</h2>}
          {action}
        </div>
      )}
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
