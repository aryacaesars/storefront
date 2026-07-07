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
    <div className={cn("overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5", className)}>
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
}: {
  children: ReactNode
  index?: number
}) {
  return (
    <tr
      className={cn(
        "border-b border-gray-100 transition-colors last:border-b-0 hover:bg-brand/5",
        index % 2 === 0 ? "bg-white" : "bg-gray-50/70",
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
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand"
    >
      <Icon className="h-4 w-4" />
    </Link>
  )
}

export function DashboardTableFooter({
  from,
  to,
  total,
}: {
  from: number
  to: number
  total: number
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/80 px-5 py-3 text-sm text-gray-500">
      <span>
        Menampilkan {from}–{to} dari {total}
      </span>
      <span className="text-gray-400">Halaman 1 dari 1</span>
    </div>
  )
}
