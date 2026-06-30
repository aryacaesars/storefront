import Link from "next/link"
import { requireAdmin } from "@/features/auth/dal"
import { getAllTemplatesAdmin } from "@/server/services/admin.service"

export const metadata = { title: "Admin — Template" }

export default async function AdminTemplatesPage() {
  await requireAdmin()
  const templates = await getAllTemplatesAdmin()

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Template Marketplace</h1>
          <p className="text-sm text-gray-400 mt-1">{templates.length} template</p>
        </div>
        <Link href="/admin/templates/new" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors">
          + Tambah Template
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-400">
          Belum ada template.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Link key={t.id} href={`/admin/templates/${t.id}`} className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-gray-300 transition-colors">
              <div className="h-32 bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
                {t.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.previewUrl} alt={t.name} className="w-full h-full object-cover" />
                ) : (
                  "Tidak ada preview"
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${t.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {t.published ? "Terbit" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{t.price === 0 ? "Gratis" : `$${(t.price / 100).toFixed(2)}`}</p>
                <p className="mt-1 text-xs text-gray-400">{t.purchaseCount} pembelian</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
