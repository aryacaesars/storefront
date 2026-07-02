import Link from "next/link"
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getCategories } from "@/server/services/product.service"
import { ProductForm } from "@/features/builder/components/ProductForm"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  DashboardPanel,
  dashboardBackLink,
} from "@/features/builder/components/dashboard-ui"
import { createProductAction } from "./actions"

export const metadata = { title: "Tambah Produk" }

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const categories = await getCategories(storeId)
  const action = createProductAction.bind(null, storeId)

  return (
    <DashboardShell
      pageTitle="Tambah Produk"
      pageSubtitle="Isi detail produk lalu tentukan apakah langsung tampil di storefront"
    >
      <div className="flex flex-col gap-4">
        <Link href={`/stores/${storeId}/products`} className={dashboardBackLink}>
          ← Kembali ke daftar produk
        </Link>
        <DashboardPanel className="p-6 lg:p-8">
          <ProductForm
            storeId={storeId}
            categories={categories}
            action={action}
            submitLabel="Tambah Produk"
          />
        </DashboardPanel>
      </div>
    </DashboardShell>
  )
}
