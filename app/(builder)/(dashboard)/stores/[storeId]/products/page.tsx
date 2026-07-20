import Link from "next/link"
import { notFound } from "next/navigation"
import { Plus } from "lucide-react"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getProducts } from "@/server/services/product.service"
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
import { DashboardPanel, dashboardBtnPrimary } from "@/features/builder/components/dashboard-ui"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const [store, t] = await Promise.all([getStoreById(storeId), getPageMessages()])
  return { title: store ? `${t.products.title} — ${store.name}` : t.products.title }
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const [products, t] = await Promise.all([getProducts(storeId), getPageMessages()])
  const total = products.length

  return (
    <DashboardShell
      pageTitle={t.products.title}
      pageSubtitle={t.products.totalLabel.replace("{n}", String(total))}
      action={
        <Link href={`/stores/${storeId}/products/new`} className={dashboardBtnPrimary}>
          <Plus className="h-4 w-4" />
          {t.products.add}
        </Link>
      }
    >
      {total === 0 ? (
        <DashboardPanel className="p-12 text-center">
          <p className="mb-4 text-sm text-gray-400">{t.products.empty}</p>
          <Link href={`/stores/${storeId}/products/new`} className={dashboardBtnPrimary}>
            <Plus className="h-4 w-4" />
            {t.products.addFirst}
          </Link>
        </DashboardPanel>
      ) : (
        <DashboardTable>
          <DashboardTableElement>
            <DashboardTableHead>
              <DashboardTableHeadRow>
                <DashboardTableHeadCell>{t.products.colProduct}</DashboardTableHeadCell>
                <DashboardTableHeadCell>{t.products.colCategory}</DashboardTableHeadCell>
                <DashboardTableHeadCell align="right">{t.products.colPrice}</DashboardTableHeadCell>
                <DashboardTableHeadCell align="right">{t.products.colStock}</DashboardTableHeadCell>
                <DashboardTableHeadCell align="center">{t.products.colStatus}</DashboardTableHeadCell>
                <DashboardTableHeadCell align="center">
                  {t.common.actions}
                </DashboardTableHeadCell>
              </DashboardTableHeadRow>
            </DashboardTableHead>
            <DashboardTableBody>
              {products.map((product, index) => (
                <DashboardTableRow key={product.id} index={index}>
                  <DashboardTableCell>
                    <DashboardTableAvatarCell name={product.name} subtitle={product.slug} />
                  </DashboardTableCell>
                  <DashboardTableCell className="text-gray-600">
                    {product.category?.name ?? "—"}
                  </DashboardTableCell>
                  <DashboardTableCell align="right" className="font-medium text-ink">
                    Rp {product.price.toLocaleString("id-ID")}
                  </DashboardTableCell>
                  <DashboardTableCell align="right" className="text-gray-600">
                    {product.stock}
                  </DashboardTableCell>
                  <DashboardTableCell align="center">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        product.published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.published ? t.common.active : t.common.draft}
                    </span>
                  </DashboardTableCell>
                  <DashboardTableCell align="center">
                    <DashboardTableActionLink
                      href={`/stores/${storeId}/products/${product.id}`}
                      label={t.products.editAria}
                    />
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
