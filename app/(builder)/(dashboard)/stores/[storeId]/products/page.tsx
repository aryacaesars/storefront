import Link from "next/link"
import { notFound } from "next/navigation"
import { Download, Filter, Plus } from "lucide-react"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getProducts } from "@/server/services/product.service"
import { DashboardBreadcrumb } from "@/features/builder/components/DashboardBreadcrumb"
import {
  DashboardTable,
  DashboardTableActionLink,
  DashboardTableBody,
  DashboardTableCell,
  DashboardTableElement,
  DashboardTableFooter,
  DashboardTableHead,
  DashboardTableHeadCell,
  DashboardTableHeadRow,
  DashboardTableProductCell,
  DashboardTableRow,
  DashboardTableStockBadge,
} from "@/features/builder/components/DashboardTable"
import {
  dashboardBtnOutline,
  dashboardBtnPrimary,
  dashboardCard,
} from "@/features/builder/components/dashboard-ui"
import { ProductsSearchBar } from "@/features/builder/components/ProductsSearchBar"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const store = await getStoreById(storeId)
  return { title: store ? `Produk — ${store.name}` : "Produk" }
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ storeId: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { storeId } = await params
  const { q } = await searchParams
  const query = q?.trim() ?? ""
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const products = await getProducts(storeId, { search: query || undefined })
  const total = products.length
  const catalogEmpty = !query && total === 0
  const noSearchResults = Boolean(query) && total === 0

  return (
    <div className="p-4 md:p-6 2xl:p-8">
      <DashboardBreadcrumb
        items={[
          { label: "Dashboard", href: `/stores/${storeId}/dashboard` },
          { label: "Produk" },
        ]}
      />

      <h1 className="mb-6 text-2xl font-bold text-gray-800">Produk</h1>

      <div className={dashboardCard}>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Products List</h2>
            <p className="mt-1 text-sm text-gray-500">
              Kelola katalog produk toko kamu dan pantau stok.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={`${dashboardBtnOutline} gap-2`}
              disabled
              title="Segera hadir"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <Link href={`/stores/${storeId}/products/new`} className={`${dashboardBtnPrimary} gap-2`}>
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-3">
          <ProductsSearchBar defaultValue={query} placeholder="Cari nama, slug, atau kategori..." />
          <button
            type="button"
            className={`${dashboardBtnOutline} gap-2 py-2 text-sm`}
            disabled
            title="Segera hadir"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {catalogEmpty ? (
          <div className="px-6 py-16 text-center">
            <p className="mb-4 text-sm text-gray-500">Belum ada produk di katalog.</p>
            <Link href={`/stores/${storeId}/products/new`} className={`${dashboardBtnPrimary} gap-2`}>
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </div>
        ) : noSearchResults ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-gray-500">
              Tidak ada produk yang cocok dengan &ldquo;{query}&rdquo;.
            </p>
          </div>
        ) : (
          <DashboardTable className="rounded-none border-0 shadow-none">
            <DashboardTableElement>
              <DashboardTableHead>
                <DashboardTableHeadRow>
                  <DashboardTableHeadCell>Products</DashboardTableHeadCell>
                  <DashboardTableHeadCell>Category</DashboardTableHeadCell>
                  <DashboardTableHeadCell>Price</DashboardTableHeadCell>
                  <DashboardTableHeadCell>Stock</DashboardTableHeadCell>
                  <DashboardTableHeadCell>Status</DashboardTableHeadCell>
                  <DashboardTableHeadCell align="center">Action</DashboardTableHeadCell>
                </DashboardTableHeadRow>
              </DashboardTableHead>
              <DashboardTableBody>
                {products.map((product) => (
                  <DashboardTableRow key={product.id}>
                    <DashboardTableCell>
                      <DashboardTableProductCell
                        name={product.name}
                        imageUrl={product.images[0]?.url}
                      />
                    </DashboardTableCell>
                    <DashboardTableCell className="text-gray-600">
                      {product.category?.name ?? "—"}
                    </DashboardTableCell>
                    <DashboardTableCell className="font-medium text-gray-800">
                      Rp {product.price.toLocaleString("id-ID")}
                    </DashboardTableCell>
                    <DashboardTableCell>
                      <DashboardTableStockBadge stock={product.stock} />
                    </DashboardTableCell>
                    <DashboardTableCell>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.published
                            ? "bg-dash-primary-light text-dash-primary"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {product.published ? "Published" : "Draft"}
                      </span>
                    </DashboardTableCell>
                    <DashboardTableCell align="center">
                      <DashboardTableActionLink
                        href={`/stores/${storeId}/products/${product.id}`}
                        label="Edit produk"
                      />
                    </DashboardTableCell>
                  </DashboardTableRow>
                ))}
              </DashboardTableBody>
            </DashboardTableElement>
            <DashboardTableFooter from={1} to={total} total={total} />
          </DashboardTable>
        )}
      </div>
    </div>
  )
}
