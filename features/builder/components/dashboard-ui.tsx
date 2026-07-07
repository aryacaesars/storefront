import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function getDashboardDisplayName(name: string | null | undefined): string {
  return name?.split(" ")[0] ?? "User"
}

export const dashboardCard =
  "rounded-xl border border-gray-200 bg-white shadow-sm"

export const dashboardCardHover =
  "transition-all duration-200 hover:border-gray-300 hover:shadow-md"

export const dashboardBtnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-dash-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dash-primary-dark"

export const dashboardBtnOutline =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-dash-primary/30 hover:bg-dash-primary/5 hover:text-dash-primary"

export const dashboardLink = "text-sm font-medium text-dash-primary hover:text-dash-primary-dark"

export const dashboardBackLink = "text-sm text-gray-500 transition-colors hover:text-dash-primary"

export const dashboardInput =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink transition-colors placeholder:text-gray-400 focus:border-dash-primary focus:outline-none focus:ring-2 focus:ring-dash-primary/15"

export const dashboardLabel = "mb-1.5 block text-sm font-medium text-gray-700"

export const dashboardTableHeadRow = "border-b border-gray-200 bg-gray-50"
export const dashboardTableHeadCell =
  "px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"

interface DashboardPanelProps {
  children: ReactNode
  className?: string
  title?: string
  action?: ReactNode
}

export function DashboardPanel({ children, className, title, action }: DashboardPanelProps) {
  return (
    <div className={cn(dashboardCard, className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          {title && <h3 className="text-base font-semibold text-gray-800">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
