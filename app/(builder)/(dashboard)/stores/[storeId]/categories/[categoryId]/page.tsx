import Link from "next/link"
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getCategoryById } from "@/server/services/product.service"
import { getPageMessages } from "@/features/i18n/get-page-messages"
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
  const [category, t] = await Promise.all([
    getCategoryById(categoryId, storeId),
    getPageMessages(),
  ])
  return {
    title: category
      ? t.categories.editTitle.replace("{name}", category.name)
      : t.categories.title,
  }
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

  const [category, t] = await Promise.all([
    getCategoryById(categoryId, storeId),
    getPageMessages(),
  ])
  if (!category) notFound()

  const updateAction = updateCategoryAction.bind(null, storeId, categoryId)
  const deleteAction = deleteCategoryAction.bind(null, storeId, categoryId)

  return (
    <DashboardShell
      pageTitle={t.categories.editTitle.replace("{name}", category.name)}
      pageSubtitle={t.categories.editSubtitle}
    >
      <div className="flex flex-col gap-4">
        <Link href={`/stores/${storeId}/categories`} className={dashboardBackLink}>
          {t.categories.backToList}
        </Link>

        <DashboardPanel className="w-full max-w-3xl p-6 lg:p-8">
          <CategoryForm
            action={updateAction}
            defaultValues={{ name: category.name, slug: category.slug }}
            productCount={category._count.products}
            submitLabel={t.categories.saveChanges}
          />
        </DashboardPanel>

        <DashboardPanel className="border-red-100 p-6">
          <p className="text-sm font-semibold text-red-700">{t.categories.dangerZone}</p>
          <p className="mt-1 text-sm text-gray-500">{t.categories.dangerBody}</p>
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
