import Link from "next/link"
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getCategoryById } from "@/server/services/product.service"
import { CategoryForm } from "@/features/builder/components/CategoryForm"
import { CategoryDeleteButton } from "@/features/builder/components/CategoryDeleteButton"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  DashboardPanel,
  dashboardBackLink,
} from "@/features/builder/components/dashboard-ui"
import { updateCategoryAction, deleteCategoryAction } from "./actions"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string; categoryId: string }>
}) {
  const { categoryId, storeId } = await params
  const category = await getCategoryById(categoryId, storeId)
  return { title: category ? `Edit — ${category.name}` : "Edit Category" }
}

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ storeId: string; categoryId: string }>
}) {
  const { storeId, categoryId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const category = await getCategoryById(categoryId, storeId)
  if (!category) notFound()

  const updateAction = updateCategoryAction.bind(null, storeId, categoryId)
  const deleteAction = deleteCategoryAction.bind(null, storeId, categoryId)

  return (
    <DashboardShell
      pageTitle={`Edit: ${category.name}`}
      pageSubtitle="Update the product category name for your store"
    >
      <div className="flex flex-col gap-4">
        <Link href={`/stores/${storeId}/categories`} className={dashboardBackLink}>
          ← Back to category list
        </Link>

        <DashboardPanel className="w-full max-w-3xl p-6 lg:p-8">
          <CategoryForm
            action={updateAction}
            defaultValues={{ name: category.name, slug: category.slug }}
            productCount={category._count.products}
            submitLabel="Save Changes"
          />
        </DashboardPanel>

        <DashboardPanel className="border-red-100 p-6">
          <p className="text-sm font-semibold text-red-700">Danger Zone</p>
          <p className="mt-1 text-sm text-gray-500">
            Deleting a category does not delete products — products will only lose their category
            label.
          </p>
          <div className="mt-4">
            <CategoryDeleteButton
              variant="button"
              categoryName={category.name}
              deleteAction={deleteAction}
              redirectTo={`/stores/${storeId}/categories`}
            />
          </div>
        </DashboardPanel>
      </div>
    </DashboardShell>
  )
}
