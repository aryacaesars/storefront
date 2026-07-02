import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function getDashboardDisplayName(name: string | null | undefined): string {
  return name?.split(" ")[0] ?? "User"
}

export const dashboardCard =
  "rounded-2xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.10)]"

export const dashboardCardHover =
  "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_16px_32px_-16px_rgba(0,0,0,0.16)]"

export const dashboardBtnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"

export const dashboardBtnOutline =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-brand/80 px-4 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/5"

export const dashboardLink = "text-sm font-semibold text-brand hover:text-brand-dark"

export const dashboardBackLink = "text-sm text-gray-400 transition-colors hover:text-brand"

export const dashboardInput =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink transition-colors placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"

export const dashboardLabel = "mb-1.5 block text-sm font-medium text-gray-700"

export const dashboardTableHeadRow = "border-b border-gray-200 bg-gray-50"
export const dashboardTableHeadCell =
  "px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"

interface DashboardPanelProps {
  children: ReactNode
  className?: string
}

export function DashboardPanel({ children, className }: DashboardPanelProps) {
  return (
    <div className={cn(dashboardCard, className)}>
      {children}
    </div>
  )
}
