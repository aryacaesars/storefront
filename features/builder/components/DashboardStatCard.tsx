import type { LucideIcon } from "lucide-react"
import { dashboardCard } from "./dashboard-ui"
import { cn } from "@/lib/utils"

interface DashboardStatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
}

export function DashboardStatCard({ label, value, icon: Icon }: DashboardStatCardProps) {
  return (
    <article className={cn(dashboardCard, "p-4 sm:p-5")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-dash-muted">{label}</p>
          <p className="mt-1 truncate text-2xl font-bold tabular-nums tracking-tight text-dash-ink sm:text-[1.75rem]">
            {value}
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dash-primary-light text-dash-primary">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </div>
      </div>
    </article>
  )
}
