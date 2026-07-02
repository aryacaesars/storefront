import { notFound } from "next/navigation"
import Link from "next/link"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getProductById, getCategories } from "@/server/services/product.service"
import { ProductForm } from "@/features/builder/components/ProductForm"
import { ProductDeleteButton } from "@/features/builder/components/ProductDeleteButton"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  DashboardPanel,
  dashboardBackLink,
} from "@/features/builder/components/dashboard-ui"
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
  searchParams,
}: {
  params: Promise<{ storeId: string; productId: string }>
  searchParams: Promise<{ toast?: string }>
}) {
  const { storeId, productId } = await params
  const { toast: toastParam } = await searchParams
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

  const initialToast =
    toastParam === "created"
      ? { type: "success" as const, message: "Produk baru berhasil dibuat.", title: "Berhasil" }
      : undefined

  return (
    <DashboardShell
      pageTitle={`Edit: ${product.name}`}
      pageSubtitle="Kelola detail produk dan visibilitas di storefront"
    >
      <div className="flex flex-col gap-4">
        <Link href={`/stores/${storeId}/products`} className={dashboardBackLink}>
          ← Kembali ke daftar produk
        </Link>

        <DashboardPanel className="p-6 lg:p-8">
          <ProductForm
            storeId={storeId}
            categories={categories}
            action={updateAction}
            initialToast={initialToast}
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
        </DashboardPanel>

        <DashboardPanel className="border-red-100 p-6">
          <p className="text-sm font-semibold text-red-700">Zona Berbahaya</p>
          <p className="mt-1 text-sm text-gray-500">
            Menghapus produk akan menghilangkannya dari dashboard dan storefront.
          </p>
          <div className="mt-4">
            <ProductDeleteButton
              storeId={storeId}
              productName={product.name}
              deleteAction={deleteAction}
            />
          </div>
        </DashboardPanel>
      </div>
    </DashboardShell>
  )
}
