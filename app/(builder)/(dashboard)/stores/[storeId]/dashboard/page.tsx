import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getStoreDashboardStats } from "@/server/services/order.service"
import { Package, Tag, ShoppingCart, TrendingUp, Palette } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params
  const store = await getStoreById(storeId)
  return { title: store ? `Dashboard — ${store.name}` : "Dashboard" }
}

export default async function StoreDashboardPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const stats = await getStoreDashboardStats(storeId)

  const cards = [
    {
      label: "Produk Aktif",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Kategori",
      value: stats.totalCategories,
      icon: Tag,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Total Order",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Revenue (PAID)",
      value: `Rp ${stats.revenueTotal.toLocaleString("id-ID")}`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{store.name}</h1>
        <p className="text-sm text-gray-400 mt-1">{store.slug}.etalase.com</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {stats.activeTemplate && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-indigo-50">
            <Palette className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Template aktif:{" "}
              <span className="capitalize font-semibold">{stats.activeTemplate}</span>
            </p>
            <p className="text-xs text-gray-400">
              Storefront kamu menggunakan template ini
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
