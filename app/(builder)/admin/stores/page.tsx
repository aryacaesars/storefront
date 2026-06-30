import { requireAdmin } from "@/features/auth/dal"
import { getAllStoresAdmin } from "@/server/services/admin.service"

export const metadata = { title: "Admin — Store" }

export default async function AdminStoresPage() {
  await requireAdmin()
  const stores = await getAllStoresAdmin()

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Store Aktif</h1>
        <p className="text-sm text-gray-400 mt-1">{stores.length} tenant</p>
      </div>

      {stores.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-400">Belum ada store.</div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Store</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produk</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dibuat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stores.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700">{s.ownerName ?? "—"}</p>
                    <p className="text-xs text-gray-400">{s.ownerEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">{s.productCount}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{s.orderCount}</td>
                  <td className="px-4 py-3 text-right text-xs text-gray-400">
                    {s.createdAt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
