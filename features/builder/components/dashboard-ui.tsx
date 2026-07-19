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
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-dash-primary px-5 py-2.5 text-sm font-medium text-white shadow-[0_1px_1.5px_rgba(0,0,0,0.1)] transition-all duration-200 hover:bg-dash-primary-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dash-primary/40 focus-visible:ring-offset-2"

export const dashboardBtnOutline =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-dash-border bg-dash-surface px-4 py-2.5 text-sm font-medium text-dash-ink transition-all duration-200 hover:border-dash-primary/25 hover:bg-dash-primary-light/50 hover:text-dash-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dash-primary/30 focus-visible:ring-offset-2"

export const dashboardFilterChip =
  "inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-dash-surface px-5 text-sm font-medium text-dash-primary shadow-[0_1px_1.5px_rgba(0,0,0,0.1)] transition-colors duration-200 hover:bg-dash-primary-light/40"

export const dashboardFilterChipActive =
  "inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-dash-surface px-5 text-sm font-medium text-dash-primary shadow-[0_1px_1.5px_rgba(0,0,0,0.1)] ring-2 ring-dash-primary/20"

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

export const dashboardSectionTitle =
  "text-[11px] font-semibold uppercase tracking-[0.08em] text-dash-muted/80"

/** Sidebar nav — pill active state ala DealDeck */
export function sidebarNavItemClass(active: boolean, compact = false) {
  return cn(
    "flex cursor-pointer items-center gap-3 rounded-full font-medium transition-all duration-200",
    compact ? "px-3 py-2 text-sm" : "px-3 py-2.5 text-sm",
    active
      ? compact
        ? // Submenu: soft tint — beda dari parent pill putih di atasnya
          "rounded-full bg-dash-primary-light font-semibold text-dash-primary ring-1 ring-dash-primary/15"
        : "rounded-full bg-dash-primary text-white"
      : "rounded-full text-dash-muted hover:bg-dash-bg/80 hover:text-dash-ink",
  )
}

export const sidebarSectionLabel = cn(dashboardSectionTitle, "mb-2 px-3")

/** Padding konsisten seluruh halaman dashboard — full width area konten */
export const dashboardPage = "w-full min-w-0 px-6 py-6 lg:px-8"

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
