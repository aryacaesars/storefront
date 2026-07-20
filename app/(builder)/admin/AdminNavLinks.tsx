"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { LayoutDashboard, LayoutTemplate, ShoppingCart, Store } from "lucide-react"
import { sidebarNavItemClass, sidebarSectionLabel } from "@/features/builder/components/dashboard-ui"
import { useMessages } from "@/features/i18n/LocaleProvider"

export function AdminNavLinks() {
  const t = useMessages().dashboard
  const pathname = usePathname()

  const nav = useMemo(
    () => [
      { href: "/admin", label: t.adminOverview, icon: LayoutDashboard, exact: true },
      { href: "/admin/templates", label: t.adminTemplates, icon: LayoutTemplate, exact: false },
      { href: "/admin/orders", label: t.adminOrders, icon: ShoppingCart, exact: false },
      { href: "/admin/stores", label: t.adminStores, icon: Store, exact: false },
    ],
    [t],
  )

  return (
    <nav className="flex flex-col gap-6">
      <div>
        <p className={sidebarSectionLabel}>{t.menu}</p>
        <div className="flex flex-col gap-1">
          {nav.map((item) => {
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
