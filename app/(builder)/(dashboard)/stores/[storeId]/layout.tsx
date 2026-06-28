import type { ReactNode } from "react"
import Link from "next/link"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { notFound } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  Palette,
  Settings,
} from "lucide-react"

const NAV_ITEMS = [
  { label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
  { label: "Produk", href: "products", icon: Package },
  { label: "Kategori", href: "categories", icon: Tag },
  { label: "Order", href: "orders", icon: ShoppingCart },
  { label: "Customer", href: "customers", icon: Users },
  { label: "Kustomisasi", href: "customize", icon: Palette },
  { label: "Pengaturan", href: "settings", icon: Settings },
]

export default async function StoreLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)

  if (!store || store.ownerId !== session.userId) notFound()

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-3 bg-white border-b border-gray-200 flex items-center gap-3">
        <Link
          href="/dashboard"
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Store
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-900">{store.name}</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <nav className="w-44 shrink-0 bg-white border-r border-gray-200 py-4 overflow-y-auto">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={`/stores/${storeId}/${href}`}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
