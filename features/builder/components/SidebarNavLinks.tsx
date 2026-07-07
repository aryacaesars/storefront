"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Store,
  Settings,
  Package,
  Tag,
  ShoppingCart,
  Users,
  Palette,
  ChevronDown,
  LayoutTemplate,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

const TOP_NAV = [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }]

const STORE_NAV = [
  { href: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "templates", label: "Template", icon: LayoutTemplate },
  { href: "products", label: "Produk", icon: Package },
  { href: "categories", label: "Kategori", icon: Tag },
  { href: "orders", label: "Order", icon: ShoppingCart },
  { href: "customers", label: "Pelanggan", icon: Users },
  { href: "customize", label: "Kustomisasi", icon: Palette },
  { href: "settings", label: "Pengaturan", icon: Settings },
]

type StoreItem = { id: string; name: string }

const navItemClass = (active: boolean) =>
  cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
    active
      ? "bg-dash-primary-light text-dash-primary"
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
  )

export function SidebarNavLinks({
  stores = [],
  isAdmin = false,
}: {
  stores?: StoreItem[]
  isAdmin?: boolean
}) {
  const pathname = usePathname()
  const storeMatch = pathname.match(/^\/stores\/([^/]+)/)
  const activeStoreId = storeMatch?.[1] ?? null

  return (
    <nav className="flex flex-col gap-1">
      {TOP_NAV.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"))
        return (
          <Link key={href} href={href} className={navItemClass(active)}>
            <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
            {label}
          </Link>
        )
      })}

      {isAdmin && (
        <Link href="/admin" className={navItemClass(pathname.startsWith("/admin"))}>
          <Shield className="h-5 w-5 shrink-0" strokeWidth={1.75} />
          Admin Panel
        </Link>
      )}

      {stores.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Toko Saya
          </p>
          {stores.map((store) => {
            const isActive = activeStoreId === store.id
            return (
              <div key={store.id} className="mb-1">
                <Link href={`/stores/${store.id}/dashboard`} className={navItemClass(isActive)}>
                  <Store className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                  <span className="flex-1 truncate">{store.name}</span>
                  {isActive && <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />}
                </Link>

                {isActive && (
                  <div className="mt-1 flex flex-col gap-0.5 pl-4">
                    {STORE_NAV.map(({ href: sub, label, icon: Icon }) => {
                      const subPath = `/stores/${store.id}/${sub}`
                      const subActive =
                        pathname === subPath || pathname.startsWith(subPath + "/")
                      return (
                        <Link
                          key={sub}
                          href={subPath}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                            subActive
                              ? "bg-dash-primary-light font-medium text-dash-primary"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                          {label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </nav>
  )
}
