import Link from "next/link"
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getCategories } from "@/server/services/product.service"
import { ProductForm } from "@/features/builder/components/ProductForm"
import { createProductAction } from "./actions"

export const metadata = { title: "Tambah Produk" }

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const categories = await getCategories(storeId)
  const action = createProductAction.bind(null, storeId)

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href={`/stores/${storeId}/products`}
          className="text-sm text-gray-400 hover:text-gray-700"
        >
          ← Produk
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">Tambah Produk</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <ProductForm
          storeId={storeId}
          categories={categories}
          action={action}
          submitLabel="Tambah Produk"
        />
      </div>
    </div>
  )
}
