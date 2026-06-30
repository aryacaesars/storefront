import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getCategories } from "@/server/services/product.service"
import { CategoryPageClient } from "./CategoryPageClient"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const store = await getStoreById(storeId)
  return { title: store ? `Kategori — ${store.name}` : "Kategori" }
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const categories = await getCategories(storeId)

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Kategori</h1>
        <p className="text-sm text-gray-400 mt-1">
          Kelola kategori produk untuk {store.name}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <CategoryPageClient categories={categories} storeId={storeId} />
      </div>
    </div>
  )
}
