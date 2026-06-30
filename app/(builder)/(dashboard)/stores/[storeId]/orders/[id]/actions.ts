"use server"

import { revalidatePath } from "next/cache"
import { redirect, notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { updateOrderStatus } from "@/server/services/order.service"
import type { OrderStatus } from "@/server/services/order.service"

/**
 * Ubah status order dari dashboard owner. Status di-bind via form action,
 * jadi FormData jadi argumen terakhir (tak dipakai).
 */
export async function updateStatusAction(
  storeId: string,
  orderId: string,
  status: OrderStatus,
  _formData: FormData,
): Promise<void> {
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const result = await updateOrderStatus(orderId, storeId, status)

  if (!result.ok) {
    redirect(`/stores/${storeId}/orders/${orderId}?error=${encodeURIComponent(result.error)}`)
  }

  revalidatePath(`/stores/${storeId}/orders/${orderId}`)
  revalidatePath(`/stores/${storeId}/orders`)
  redirect(`/stores/${storeId}/orders/${orderId}`)
}
