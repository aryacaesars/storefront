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
  return { title: product ? `Edit — ${product.name}` : "Edit Product" }
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
      ? { type: "success" as const, message: "New product created successfully.", title: "Success" }
      : undefined

  return (
    <DashboardShell
      pageTitle={`Edit: ${product.name}`}
      pageSubtitle="Manage product details and storefront visibility"
    >
      <div className="flex flex-col gap-4">
        <Link href={`/stores/${storeId}/products`} className={dashboardBackLink}>
          ← Back to product list
        </Link>

        <DashboardPanel className="w-full max-w-3xl p-6 lg:p-8">
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
            submitLabel="Save Changes"
          />
        </DashboardPanel>

        <DashboardPanel className="border-red-100 p-6">
          <p className="text-sm font-semibold text-red-700">Danger Zone</p>
          <p className="mt-1 text-sm text-gray-500">
            Deleting this product will remove it from the dashboard and storefront.
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
