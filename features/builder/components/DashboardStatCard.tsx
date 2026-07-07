import type { LucideIcon } from "lucide-react"

interface DashboardStatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
}

export function DashboardStatCard({ label, value, icon: Icon }: DashboardStatCardProps) {
  return (
    <article className="rounded-3xl bg-linear-to-b from-brand/25 to-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.10)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-3xl font-extrabold leading-none tracking-tight text-brand">
            {value}
          </p>
          <p className="mt-2 text-sm font-semibold text-brand/80">{label}</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/30">
          <Icon className="h-6 w-6" strokeWidth={2} />
        </div>
      </div>
    </article>
  )
}
