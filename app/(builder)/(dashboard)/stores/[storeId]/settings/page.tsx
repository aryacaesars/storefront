import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { SettingsForm } from "./SettingsForm"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const store = await getStoreById(storeId)
  return { title: store ? `Pengaturan — ${store.name}` : "Pengaturan" }
}

export default async function StoreSettingsPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Pengaturan Store</h1>
        <p className="text-sm text-gray-400 mt-1">{store.slug}.etalase.com</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SettingsForm storeId={storeId} defaultName={store.name} />
      </div>
    </div>
  )
}
