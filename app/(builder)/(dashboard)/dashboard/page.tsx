import { requireSession } from "@/features/auth/dal"
import { getStoresByOwnerId } from "@/server/services/tenant.service"
import Link from "next/link"

export const metadata = { title: "Dashboard — Etalase" }

export default async function DashboardPage() {
  const session = await requireSession()
  const stores = await getStoresByOwnerId(session.userId)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Store Saya</h1>
        <Link
          href="/stores/new"
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          + Buat Store
        </Link>
      </div>

      {stores.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="mb-4 text-base">Belum ada store. Buat store pertama kamu.</p>
          <Link
            href="/stores/new"
            className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Buat Store Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((store) => (
            <Link
              key={store.id}
              href={`/stores/${store.id}/dashboard`}
              className="p-5 bg-white border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-sm transition-all"
            >
              <p className="font-semibold text-gray-900">{store.name}</p>
              <p className="text-sm text-gray-400 mt-1">{store.slug}.etalase.com</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
