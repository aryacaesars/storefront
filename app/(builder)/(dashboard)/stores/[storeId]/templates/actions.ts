"use server"

import { redirect, notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import {
  getTemplateById,
  getPurchasedTemplateIds,
  createPendingPurchase,
  activateTemplate,
} from "@/server/services/template.service"
import { stripe } from "@/lib/stripe"

export async function buyTemplate(storeId: string, templateId: string): Promise<void> {
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const template = await getTemplateById(templateId)
  if (!template || !template.published) notFound()

  // Template gratis — langsung aktifkan tanpa Stripe
  if (template.price === 0) {
    await activateTemplate(storeId, templateId)
    redirect(`/stores/${storeId}/templates?success=1`)
  }

  // Cek apakah sudah dibeli
  const purchasedIds = await getPurchasedTemplateIds(storeId)
  if (purchasedIds.has(templateId)) {
    // Sudah dibeli, langsung aktifkan
    await activateTemplate(storeId, templateId)
    redirect(`/stores/${storeId}/templates?success=1`)
  }

  // Buat Stripe Checkout Session
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "idr",
          // Stripe IDR pakai 2 desimal (bukan zero-decimal): harga disimpan
          // rupiah utuh, unit_amount = rupiah × 100.
          unit_amount: template.price * 100,
          product_data: { name: template.name },
        },
        quantity: 1,
      },
    ],
    metadata: { storeId, templateId },
    success_url: `${appUrl}/stores/${storeId}/templates?success=1`,
    cancel_url: `${appUrl}/stores/${storeId}/templates`,
  })

  // Simpan purchase record PENDING
  await createPendingPurchase({
    storeId,
    templateId,
    stripeSessionId: stripeSession.id,
  })

  // Redirect ke Stripe hosted checkout — harus di luar try/catch
  redirect(stripeSession.url!)
}
