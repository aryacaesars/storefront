"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LayoutTemplate, ShoppingCart, Store } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/templates", label: "Template", icon: LayoutTemplate, exact: false },
  { href: "/admin/orders", label: "Transaksi", icon: ShoppingCart, exact: false },
  { href: "/admin/stores", label: "Store", icon: Store, exact: false },
]

export function AdminNavLinks() {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1 px-2">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              active ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
