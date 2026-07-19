"use server"

import { redirect } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { buyTemplate } from "@/app/(builder)/(dashboard)/stores/[storeId]/templates/actions"

/**
 * Beli/aktifkan template untuk toko tertentu (license per store, ala Shopify).
 * Dipakai dari /templates setelah merchant memilih toko target.
 */
export async function purchaseTemplateForStore(
  storeId: string,
  templateId: string,
): Promise<void> {
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) {
    redirect("/login")
  }
  await buyTemplate(storeId, templateId)
}
