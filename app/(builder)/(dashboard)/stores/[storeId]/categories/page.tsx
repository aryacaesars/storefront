import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getCategoriesWithCounts } from "@/server/services/product.service"
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
  const store = await getStoreById(storeId)
  return { title: store ? `Categories — ${store.name}` : "Categories" }
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

  const categories = await getCategoriesWithCounts(storeId)
  const total = categories.length

  return (
    <DashboardShell
      pageTitle="Categories"
      pageSubtitle={`Total: ${total} categories`}
    >
      <DashboardPanel className="mb-6 p-6">
        <p className="mb-3 text-sm font-medium text-ink">Add Category</p>
        <CategoryAddForm storeId={storeId} />
      </DashboardPanel>

      {total === 0 ? (
        <DashboardPanel className="p-12 text-center">
          <p className="text-sm text-gray-400">No categories yet.</p>
        </DashboardPanel>
      ) : (
        <DashboardTable>
          <DashboardTableElement>
            <DashboardTableHead>
              <DashboardTableHeadRow>
                <DashboardTableHeadCell>Categories</DashboardTableHeadCell>
                <DashboardTableHeadCell align="right">Products</DashboardTableHeadCell>
                <DashboardTableHeadCell align="center">Actions</DashboardTableHeadCell>
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
                        label="Edit category"
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
