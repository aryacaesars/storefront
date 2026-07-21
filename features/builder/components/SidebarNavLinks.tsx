"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
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
  HelpCircle,
  Compass,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMessages } from "@/features/i18n/LocaleProvider"
import { sidebarNavItemClass, sidebarSectionLabel } from "./dashboard-ui"

type StoreItem = { id: string; name: string }

export function SidebarNavLinks({
  stores: initialStores = [],
  isAdmin = false,
}: {
  stores?: StoreItem[]
  isAdmin?: boolean
}) {
  const t = useMessages().dashboard
  const pathname = usePathname()
  const router = useRouter()
  const stores = initialStores
  const [isPending, startTransition] = useTransition()
  const [pendingStoreId, setPendingStoreId] = useState<string | null>(null)

  const topNav = useMemo(
    () => [
      { href: "/dashboard", label: t.storeDashboard, icon: LayoutDashboard },
      { href: "/templates", label: t.browseTemplate, icon: Compass },
    ],
    [t.browseTemplate, t.storeDashboard],
  )

  const storeNav = useMemo(
    () => [
      { href: "dashboard", label: t.storeDashboard, icon: LayoutDashboard },
      { href: "templates", label: t.storeTemplate, icon: LayoutTemplate },
      { href: "products", label: t.products, icon: Package },
      { href: "categories", label: t.categories, icon: Tag },
      { href: "orders", label: t.orders, icon: ShoppingCart },
      { href: "customers", label: t.customers, icon: Users },
      { href: "customize", label: t.customize, icon: Palette },
      { href: "settings", label: t.settings, icon: Settings },
    ],
    [t],
  )

  const toolsNav = useMemo(
    () => [{ href: "/support", label: t.support, icon: HelpCircle }],
    [t.support],
  )

  const storeMatch = pathname.match(/^\/stores\/([^/]+)/)
  const activeStoreId = storeMatch?.[1] ?? null

  const [openStoreId, setOpenStoreId] = useState<string | null>(activeStoreId)
  const [prevActiveStoreId, setPrevActiveStoreId] = useState<string | null>(activeStoreId)

  // Sinkronkan saat navigasi mengganti store aktif — adjust state ketika render
  // (bukan di effect): auto-buka store aktif & bersihkan status pending switch.
  if (activeStoreId !== prevActiveStoreId) {
    setPrevActiveStoreId(activeStoreId)
    setOpenStoreId(activeStoreId)
    if (pendingStoreId && activeStoreId === pendingStoreId) {
      setPendingStoreId(null)
    }
  }

  function onStoreClick(storeId: string) {
    const isOpen = openStoreId === storeId

    if (isOpen) {
      setOpenStoreId(null)
      return
    }

    setOpenStoreId(storeId)

    if (storeId !== activeStoreId) {
      setPendingStoreId(storeId)
      startTransition(() => {
        router.push(`/stores/${storeId}/dashboard`)
      })
    }
  }

  return (
    <nav className="flex flex-col gap-6">
      <div>
        <p className={sidebarSectionLabel}>{t.menu}</p>
        <div className="flex flex-col gap-1">
          {topNav.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"))
            return (
              <Link key={href} href={href} className={sidebarNavItemClass(active)}>
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                {label}
              </Link>
            )
          })}

          {isAdmin && (
            <Link href="/admin" className={sidebarNavItemClass(pathname.startsWith("/admin"))}>
              <Shield className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
              {t.adminPanel}
            </Link>
          )}
        </div>
      </div>

      {stores.length > 0 && (
        <div>
          <p className={sidebarSectionLabel}>{t.myStores}</p>
          <div className="flex flex-col gap-1">
            {stores.map((store) => {
              const isActive = activeStoreId === store.id
              const isOpen = openStoreId === store.id
              const isSwitchingTo = pendingStoreId === store.id && isPending
              const isHighlighted = isOpen || isActive || isSwitchingTo

              return (
                <div
                  key={store.id}
                  className={cn(
                    "rounded-2xl transition-colors duration-200",
                    isOpen && "bg-dash-bg/70 ring-1 ring-dash-border/70",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onStoreClick(store.id)}
                    disabled={isSwitchingTo}
                    className={cn(
                      sidebarNavItemClass(isHighlighted),
                      "w-full text-left shadow-none",
                      isSwitchingTo && "opacity-90",
                    )}
                    aria-expanded={isOpen}
                    aria-current={isActive ? "page" : undefined}
                    aria-busy={isSwitchingTo || undefined}
                  >
                    <Store className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                    <span className="flex-1 truncate">{store.name}</span>
                    {isSwitchingTo ? (
                      <Loader2
                        className="h-4 w-4 shrink-0 animate-spin text-white/90"
                        strokeWidth={2}
                      />
                    ) : (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200 ease-out",
                          isOpen
                            ? "rotate-0 text-white/80"
                            : "-rotate-90 opacity-50",
                          isHighlighted && !isOpen && "text-white/80 opacity-80",
                        )}
                      />
                    )}
                  </button>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-4 mt-1 border-l border-dash-border/80 pb-2 pl-2.5">
                        <div className="flex flex-col gap-0.5 pt-1">
                          {storeNav.map(({ href: sub, label, icon: Icon }) => {
                            const subPath = `/stores/${store.id}/${sub}`
                            const subActive =
                              pathname === subPath || pathname.startsWith(subPath + "/")
                            return (
                              <Link
                                key={sub}
                                href={subPath}
                                className={cn(
                                  sidebarNavItemClass(subActive, true),
                                  isSwitchingTo && "pointer-events-none opacity-60",
                                )}
                              >
                                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                                {label}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <p className={sidebarSectionLabel}>{t.tools}</p>
        <div className="flex flex-col gap-1">
          {toolsNav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link key={href} href={href} className={sidebarNavItemClass(active)}>
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
