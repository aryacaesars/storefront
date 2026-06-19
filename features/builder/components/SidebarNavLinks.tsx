"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Store, Settings, Package } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/connect", label: "Katalog", icon: Package },
  { href: "/templates", label: "Storefront", icon: Store },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function SidebarNavLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-0.5 px-2">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/")
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              active
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            {active && (
              <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-indigo-600 rounded-r-full" />
            )}
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
