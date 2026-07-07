import type { LucideIcon } from "lucide-react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { dashboardCard } from "@/features/builder/components/dashboard-ui"

interface DashboardStatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: number
}

export function DashboardStatCard({ label, value, icon: Icon, trend }: DashboardStatCardProps) {
  const trendUp = trend === undefined || trend >= 0

  return (
    <article className={`${dashboardCard} p-5 md:p-6`}>
      <div className="flex items-center justify-center rounded-xl bg-dash-primary/10 p-3 w-fit">
        <Icon className="h-6 w-6 text-dash-primary" strokeWidth={1.75} />
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <h4 className="text-2xl font-bold text-gray-800 md:text-3xl">{value}</h4>
          <p className="mt-1 text-sm text-gray-500">{label}</p>
        </div>

        {trend !== undefined && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              trendUp
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {trendUp ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </article>
  )
}
