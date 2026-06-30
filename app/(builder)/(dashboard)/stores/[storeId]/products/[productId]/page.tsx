import { notFound } from "next/navigation"
import Link from "next/link"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getProductById, getCategories } from "@/server/services/product.service"
import { ProductForm } from "@/features/builder/components/ProductForm"
import { updateProductAction, deleteProductAction } from "./actions"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string; productId: string }>
}) {
  const { productId, storeId } = await params
  const product = await getProductById(productId, storeId)
  return { title: product ? `Edit — ${product.name}` : "Edit Produk" }
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ storeId: string; productId: string }>
}) {
  const { storeId, productId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const [product, categories] = await Promise.all([
    getProductById(productId, storeId),
    getCategories(storeId),
  ])
  if (!product) notFound()

  const updateAction = updateProductAction.bind(null, storeId, productId)
  const deleteAction = deleteProductAction.bind(null, storeId, productId)

  const firstImage = product.images[0]?.url ?? ""

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href={`/stores/${storeId}/products`}
          className="text-sm text-gray-400 hover:text-gray-700"
        >
          ← Produk
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          Edit: {product.name}
        </h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-6">
        <ProductForm
          storeId={storeId}
          categories={categories}
          action={updateAction}
          defaultValues={{
            name: product.name,
            description: product.description ?? "",
            price: product.price,
            stock: product.stock,
            published: product.published,
            categoryId: product.categoryId ?? "",
            imageUrl: firstImage,
          }}
          submitLabel="Simpan Perubahan"
        />

        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3">Zona Berbahaya</p>
          <form action={deleteAction}>
            <button
              type="submit"
              className="px-5 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              Hapus Produk
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
