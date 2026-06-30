import Link from "next/link"
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import {
  getPublishedTemplates,
  getPurchasedTemplateIds,
  getActiveTemplateId,
} from "@/server/services/template.service"
import { buyTemplate } from "./actions"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const store = await getStoreById(storeId)
  return { title: store ? `Template — ${store.name}` : "Template" }
}

export default async function TemplatesPage({
  params,
  searchParams,
}: {
  params: Promise<{ storeId: string }>
  searchParams: Promise<{ success?: string }>
}) {
  const { storeId } = await params
  const { success } = await searchParams
  const session = await requireSession()
  const store = await getStoreById(storeId)

  if (!store || store.ownerId !== session.userId) notFound()

  const [templates, purchasedIds, activeTemplateId] = await Promise.all([
    getPublishedTemplates(),
    getPurchasedTemplateIds(storeId),
    getActiveTemplateId(storeId),
  ])

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Template</h1>
        <p className="text-sm text-gray-400 mt-1">
          Pilih template untuk storefront {store.name}
        </p>
      </div>

      {success === "1" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          Pembayaran berhasil! Template sudah aktif di storefront kamu.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const isPurchased = purchasedIds.has(template.id)
          const isActive = activeTemplateId === template.slug
          const isFree = template.price === 0

          return (
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col"
            >
              <div className="h-36 bg-gray-100 flex items-center justify-center text-gray-300 text-sm">
                {template.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={template.previewUrl}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "Preview tidak tersedia"
                )}
              </div>

              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{template.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 shrink-0">
                    {isFree ? "Gratis" : `$${(template.price / 100).toFixed(2)}`}
                  </span>
                </div>

                <div className="mt-auto flex flex-col gap-2">
                  <Link
                    href={`/stores/${storeId}/customize?template=${template.slug}`}
                    className="w-full py-2 px-4 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors text-center"
                  >
                    Kustomisasi
                  </Link>
                  {isActive ? (
                    <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
                      &#10003; Template Aktif
                    </span>
                  ) : isPurchased || isFree ? (
                    <form action={buyTemplate.bind(null, storeId, template.id)}>
                      <button
                        type="submit"
                        className="w-full py-2 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
                      >
                        Aktifkan
                      </button>
                    </form>
                  ) : (
                    <form action={buyTemplate.bind(null, storeId, template.id)}>
                      <button
                        type="submit"
                        className="w-full py-2 px-4 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Beli &mdash; ${(template.price / 100).toFixed(2)}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
