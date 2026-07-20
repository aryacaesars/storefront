import Link from "next/link"
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getCategories } from "@/server/services/product.service"
import { getPageMessages } from "@/features/i18n/get-page-messages"
import { ProductForm } from "@/features/builder/components/ProductForm"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  DashboardPanel,
  dashboardBackLink,
} from "@/features/builder/components/dashboard-ui"
import { createProductAction } from "./actions"

export async function generateMetadata() {
  const t = await getPageMessages()
  return { title: t.products.addTitle }
}

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const [categories, t] = await Promise.all([getCategories(storeId), getPageMessages()])
  const action = createProductAction.bind(null, storeId)

  return (
    <DashboardShell
      pageTitle={t.products.addTitle}
      pageSubtitle={t.products.addSubtitle}
    >
      <div className="flex flex-col gap-4">
        <Link href={`/stores/${storeId}/products`} className={dashboardBackLink}>
          {t.products.backToList}
        </Link>
        <DashboardPanel className="w-full p-6 lg:p-8">
          <ProductForm
            storeId={storeId}
            categories={categories}
            action={action}
            submitLabel={t.products.add}
          />
        </DashboardPanel>
      </div>
    </DashboardShell>
  )
}
