import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getProductById, getCategories } from "@/server/services/product.service"
import { getPageMessages } from "@/features/i18n/get-page-messages"
import { ProductForm } from "@/features/builder/components/ProductForm"
import { ProductDeleteButton } from "@/features/builder/components/ProductDeleteButton"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { updateProductAction, deleteProductAction } from "./actions"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string; productId: string }>
}) {
  const { productId, storeId } = await params
  const [product, t] = await Promise.all([
    getProductById(productId, storeId),
    getPageMessages(),
  ])
  return {
    title: product
      ? t.products.editTitle.replace("{name}", product.name)
      : t.products.title,
  }
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

  const [product, categories, t] = await Promise.all([
    getProductById(productId, storeId),
    getCategories(storeId),
    getPageMessages(),
  ])
  if (!product) notFound()

  const updateAction = updateProductAction.bind(null, storeId, productId)
  const deleteAction = deleteProductAction.bind(null, storeId, productId)
  const firstImage = product.images[0]?.url ?? ""

  const initialToast =
    toastParam === "created"
      ? {
          type: "success" as const,
          message: t.products.createdToast,
          title: t.common.success,
        }
      : undefined

  return (
    <DashboardShell
      pageTitle={t.products.editTitle.replace("{name}", product.name)}
      pageSubtitle={t.products.editSubtitle}
    >
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
          variants: product.variants.map((variant) => ({
            id: variant.id,
            label: variant.label,
            sku: variant.sku,
            size: variant.size,
            color: variant.color,
            price: variant.price,
            stock: variant.stock,
            imageUrl: variant.imageUrl,
          })),
        }}
        submitLabel={t.products.saveChanges}
        extraActions={
          <ProductDeleteButton
            storeId={storeId}
            productName={product.name}
            deleteAction={deleteAction}
          />
        }
      />
    </DashboardShell>
  )
}
