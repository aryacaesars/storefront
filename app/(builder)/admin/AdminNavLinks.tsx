"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LayoutTemplate, ShoppingCart, Store } from "lucide-react"
import { sidebarNavItemClass, sidebarSectionLabel } from "@/features/builder/components/dashboard-ui"

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/templates", label: "Template", icon: LayoutTemplate, exact: false },
  { href: "/admin/orders", label: "Transactions", icon: ShoppingCart, exact: false },
  { href: "/admin/stores", label: "Store", icon: Store, exact: false },
]

export function AdminNavLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-6">
      <div>
        <p className={sidebarSectionLabel}>Menu</p>
        <div className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className={sidebarNavItemClass(active)}>
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
