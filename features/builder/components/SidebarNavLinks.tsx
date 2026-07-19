"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
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
import { sidebarNavItemClass, sidebarSectionLabel } from "./dashboard-ui"

const TOP_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/templates", label: "Browse Template", icon: Compass },
]

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

const TOOLS_NAV = [{ href: "/support", label: "Bantuan", icon: HelpCircle }]

type StoreItem = { id: string; name: string }

export function SidebarNavLinks({
  stores: initialStores = [],
  isAdmin = false,
}: {
  stores?: StoreItem[]
  isAdmin?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [stores, setStores] = useState(initialStores)
  const [isPending, startTransition] = useTransition()
  const [pendingStoreId, setPendingStoreId] = useState<string | null>(null)

  const storeMatch = pathname.match(/^\/stores\/([^/]+)/)
  const activeStoreId = storeMatch?.[1] ?? null

  // Accordion: toko mana yang submenu-nya terbuka.
  const [openStoreId, setOpenStoreId] = useState<string | null>(activeStoreId)

  useEffect(() => {
    setStores(initialStores)
  }, [initialStores])

  useEffect(() => {
    let cancelled = false

    async function refreshStores() {
      try {
        const res = await fetch("/api/stores", { cache: "no-store" })
        if (!res.ok) return
        const data = (await res.json()) as StoreItem[]
        if (!cancelled) setStores(data)
      } catch {
        // keep last known list
      }
    }

    void refreshStores()
    return () => {
      cancelled = true
    }
  }, [pathname])

  // Sinkron accordion dengan konteks URL:
  // di dalam /stores/:id → buka toko itu; ke menu merchant utama → tutup.
  useEffect(() => {
    setOpenStoreId(activeStoreId)
  }, [activeStoreId])

  useEffect(() => {
    if (pendingStoreId && activeStoreId === pendingStoreId) {
      setPendingStoreId(null)
    }
  }, [activeStoreId, pendingStoreId])

  function onStoreClick(storeId: string) {
    const isOpen = openStoreId === storeId

    // Sudah terbuka → tutup saja (tetap di halaman sekarang).
    if (isOpen) {
      setOpenStoreId(null)
      return
    }

    // Buka accordion.
    setOpenStoreId(storeId)

    // Belum jadi toko aktif di URL → navigasi ke dashboard toko itu.
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
        <p className={sidebarSectionLabel}>Menu</p>
        <div className="flex flex-col gap-1">
          {TOP_NAV.map(({ href, label, icon: Icon }) => {
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
              Admin Panel
            </Link>
          )}
        </div>
      </div>

      {stores.length > 0 && (
        <div>
          <p className={sidebarSectionLabel}>Toko Saya</p>
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
                          {STORE_NAV.map(({ href: sub, label, icon: Icon }) => {
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
        <p className={sidebarSectionLabel}>Tools</p>
        <div className="flex flex-col gap-1">
          {TOOLS_NAV.map(({ href, label, icon: Icon }) => {
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
