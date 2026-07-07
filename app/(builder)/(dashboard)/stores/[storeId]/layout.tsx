import type { ReactNode } from "react"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { notFound } from "next/navigation"

export default async function StoreLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)

  if (!store || store.ownerId !== session.userId) notFound()

  return <>{children}</>
}
