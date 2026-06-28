import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { notFound } from "next/navigation"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const store = await getStoreById(storeId)
  return { title: store ? `${store.name} — Etalase` : "Store" }
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{store.name}</h1>
        <p className="text-sm text-gray-400 mt-1">
          {store.slug}.etalase.com
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 bg-white border border-gray-200 rounded-xl">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Produk
          </p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">0</p>
        </div>
        <div className="p-5 bg-white border border-gray-200 rounded-xl">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Order
          </p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">0</p>
        </div>
        <div className="p-5 bg-white border border-gray-200 rounded-xl">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Customer
          </p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">0</p>
        </div>
      </div>

      <div className="p-5 bg-white border border-gray-200 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-1">URL Storefront</p>
        <p className="text-sm text-gray-400">
          {store.slug}.etalase.com
        </p>
        <p className="text-xs text-gray-300 mt-2">
          Storefront aktif setelah template dipilih dan dikustomisasi.
        </p>
      </div>
    </div>
  )
}
