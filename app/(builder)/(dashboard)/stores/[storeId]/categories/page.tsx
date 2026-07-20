import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getCategoriesWithCounts } from "@/server/services/product.service"
import { getPageMessages } from "@/features/i18n/get-page-messages"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  DashboardTable,
  DashboardTableActionLink,
  DashboardTableAvatarCell,
  DashboardTableBody,
  DashboardTableCell,
  DashboardTableElement,
  DashboardTableFooter,
  DashboardTableHead,
  DashboardTableHeadCell,
  DashboardTableHeadRow,
  DashboardTableRow,
} from "@/features/builder/components/DashboardTable"
import { DashboardPanel } from "@/features/builder/components/dashboard-ui"
import { CategoryAddForm } from "./CategoryAddForm"
import { CategoryDeleteButton } from "@/features/builder/components/CategoryDeleteButton"
import { deleteCategoryAction } from "./actions"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const [store, t] = await Promise.all([getStoreById(storeId), getPageMessages()])
  return { title: store ? `${t.categories.title} — ${store.name}` : t.categories.title }
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

  const [categories, t] = await Promise.all([
    getCategoriesWithCounts(storeId),
    getPageMessages(),
  ])
  const total = categories.length

  return (
    <DashboardShell
      pageTitle={t.categories.title}
      pageSubtitle={t.categories.totalLabel.replace("{n}", String(total))}
    >
      <DashboardPanel className="mb-6 p-6">
        <p className="mb-3 text-sm font-medium text-ink">{t.categories.add}</p>
        <CategoryAddForm storeId={storeId} />
      </DashboardPanel>

      {total === 0 ? (
        <DashboardPanel className="p-12 text-center">
          <p className="text-sm text-gray-400">{t.categories.empty}</p>
        </DashboardPanel>
      ) : (
        <DashboardTable>
          <DashboardTableElement>
            <DashboardTableHead>
              <DashboardTableHeadRow>
                <DashboardTableHeadCell>{t.categories.colCategory}</DashboardTableHeadCell>
                <DashboardTableHeadCell align="right">{t.categories.colProducts}</DashboardTableHeadCell>
                <DashboardTableHeadCell align="center">{t.common.actions}</DashboardTableHeadCell>
              </DashboardTableHeadRow>
            </DashboardTableHead>
            <DashboardTableBody>
              {categories.map((category, index) => (
                <DashboardTableRow key={category.id} index={index}>
                  <DashboardTableCell>
                    <DashboardTableAvatarCell
                      name={category.name}
                      subtitle={category.slug}
                    />
                  </DashboardTableCell>
                  <DashboardTableCell align="right" className="text-gray-600">
                    {category._count.products}
                  </DashboardTableCell>
                  <DashboardTableCell align="center">
                    <div className="flex items-center justify-center gap-1">
                      <DashboardTableActionLink
                        href={`/stores/${storeId}/categories/${category.id}`}
                        label={t.categories.editAria}
                      />
                      <CategoryDeleteButton
                        categoryName={category.name}
                        deleteAction={deleteCategoryAction.bind(
                          null,
                          storeId,
                          category.id,
                        )}
                      />
                    </div>
                  </DashboardTableCell>
                </DashboardTableRow>
              ))}
            </DashboardTableBody>
          </DashboardTableElement>
          <DashboardTableFooter from={1} to={total} total={total} />
        </DashboardTable>
      )}
    </DashboardShell>
  )
}
