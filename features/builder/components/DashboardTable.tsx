import type { ReactNode } from "react"
import Link from "next/link"
import { Eye, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  dashboardTableHeadCell,
  dashboardTableHeadRow,
} from "@/features/builder/components/dashboard-ui"

export function DashboardTable({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm", className)}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}

export function DashboardTableElement({ children }: { children: ReactNode }) {
  return <table className="w-full min-w-[640px] text-sm">{children}</table>
}

type Align = "left" | "right" | "center"

export function DashboardTableHead({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <thead className={className}>{children}</thead>
}

export function DashboardTableHeadCell({
  children,
  align = "left",
  className,
}: {
  children: ReactNode
  align?: Align
  className?: string
}) {
  return (
    <th
      className={cn(
        dashboardTableHeadCell,
        align === "left" && "text-left",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </th>
  )
}

export function DashboardTableHeadRow({ children }: { children: ReactNode }) {
  return <tr className={dashboardTableHeadRow}>{children}</tr>
}

export function DashboardTableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>
}

export function DashboardTableRow({
  children,
  index = 0,
  striped = false,
}: {
  children: ReactNode
  index?: number
  striped?: boolean
}) {
  return (
    <tr
      className={cn(
        "border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50",
        striped && index % 2 === 1 && "bg-gray-50/50",
      )}
    >
      {children}
    </tr>
  )
}

export function DashboardTableCell({
  children,
  align = "left",
  className,
}: {
  children: ReactNode
  align?: Align
  className?: string
}) {
  return (
    <td
      className={cn(
        "px-5 py-4",
        align === "left" && "text-left",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </td>
  )
}

export function DashboardTableAvatarCell({
  name,
  subtitle,
}: {
  name: string
  subtitle?: string
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?"

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dash-primary/10 text-sm font-semibold text-dash-primary">
        {initial}
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-ink">{name}</p>
        {subtitle && <p className="truncate text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  )
}

export function DashboardTableActionLink({
  href,
  label,
  icon = "pencil",
}: {
  href: string
  label?: string
  icon?: "pencil" | "eye"
}) {
  const Icon = icon === "eye" ? Eye : Pencil

  return (
    <Link
      href={href}
      title={label ?? "Edit"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-dash-primary/30 hover:bg-dash-primary/5 hover:text-dash-primary"
    >
      <Icon className="h-4 w-4" />
    </Link>
  )
}

export function DashboardTableProductCell({
  name,
  imageUrl,
}: {
  name: string
  imageUrl?: string | null
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?"

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm font-semibold text-gray-400">{initial}</span>
        )}
      </div>
      <p className="min-w-0 truncate font-medium text-gray-800">{name}</p>
    </div>
  )
}

export function DashboardTableStockBadge({ stock }: { stock: number }) {
  const inStock = stock > 0
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums",
        inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600",
      )}
    >
      {stock}
    </span>
  )
}

export function DashboardTableFooter({
  from,
  to,
  total,
  page = 1,
  totalPages = 1,
}: {
  from: number
  to: number
  total: number
  page?: number
  totalPages?: number
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 px-5 py-4">
      <p className="text-sm text-gray-500">
        Showing {from} to {to} of {total}
      </p>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {pages.map((p) => (
              <span
                key={p}
                className={cn(
                  "inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium",
                  p === page
                    ? "bg-dash-primary text-white"
                    : "border border-gray-200 text-gray-600",
                )}
              >
                {p}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
