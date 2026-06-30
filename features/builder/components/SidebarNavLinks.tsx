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

const TOP_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
]

const STORE_NAV = [
  { href: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "templates", label: "Template", icon: LayoutTemplate },
  { href: "products", label: "Produk", icon: Package },
  { href: "categories", label: "Kategori", icon: Tag },
  { href: "orders", label: "Order", icon: ShoppingCart },
  { href: "customers", label: "Customer", icon: Users },
  { href: "customize", label: "Kustomisasi", icon: Palette },
  { href: "settings", label: "Pengaturan", icon: Settings },
]

type StoreItem = { id: string; name: string }

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
    <nav className="flex flex-col gap-0.5 px-2">
      {TOP_NAV.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href ||
          (href !== "/dashboard" && pathname.startsWith(href + "/"))
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

      {isAdmin && (
        <Link
          href="/admin"
          className={cn(
            "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            pathname.startsWith("/admin")
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          {pathname.startsWith("/admin") && (
            <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-indigo-600 rounded-r-full" />
          )}
          <Shield className="w-4 h-4 shrink-0" />
          Admin Panel
        </Link>
      )}

      {stores.length > 0 && (
        <div className="mt-3">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Toko Saya
          </p>
          {stores.map((store) => {
            const isActive = activeStoreId === store.id
            return (
              <div key={store.id}>
                <Link
                  href={`/stores/${store.id}/dashboard`}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-indigo-600 rounded-r-full" />
                  )}
                  <Store className="w-4 h-4 shrink-0" />
                  <span className="flex-1 truncate">{store.name}</span>
                  {isActive && (
                    <ChevronDown className="w-3 h-3 shrink-0 opacity-60" />
                  )}
                </Link>

                {isActive && (
                  <div className="ml-3 pl-3 border-l border-gray-200 mt-0.5 mb-1 flex flex-col gap-0.5">
                    {STORE_NAV.map(({ href: sub, label, icon: Icon }) => {
                      const subPath = `/stores/${store.id}/${sub}`
                      const subActive =
                        pathname === subPath || pathname.startsWith(subPath + "/")
                      return (
                        <Link
                          key={sub}
                          href={subPath}
                          className={cn(
                            "flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors",
                            subActive
                              ? "text-indigo-700 font-medium bg-indigo-50"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
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
