"use server"

import { revalidatePath } from "next/cache"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { themeConfigSchema, type ThemeConfig } from "@/themes/engine/schema"
import {
  saveThemeDraft as saveThemeDraftToDb,
  publishTheme as publishThemeToDb,
} from "@/server/services/theme.service"
import { isTemplateAccessible } from "@/server/services/template.service"
import { notFound } from "next/navigation"

async function requireStoreOwner(storeId: string) {
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()
  return store
}

export async function saveThemeDraftForStore(
  storeId: string,
  config: ThemeConfig,
): Promise<void> {
  await requireStoreOwner(storeId)
  const parsed = themeConfigSchema.parse(config)
  await saveThemeDraftToDb(storeId, parsed)
  revalidatePath(`/stores/${storeId}/customize`)
}

export type PublishResult = { ok: true } | { ok: false; reason: "PAYMENT_REQUIRED" }

export async function publishThemeForStore(
  storeId: string,
  config: ThemeConfig,
): Promise<PublishResult> {
  await requireStoreOwner(storeId)
  const parsed = themeConfigSchema.parse(config)
  const canPublish = await isTemplateAccessible(storeId, parsed.templateId)
  if (!canPublish) {
    // Jangan throw: di prod Next menyamarkan error server action jadi 500 tanpa message,
    // sehingga paywall di client tidak pernah muncul.
    return { ok: false, reason: "PAYMENT_REQUIRED" }
  }
  await publishThemeToDb(storeId, parsed)
  revalidatePath(`/stores/${storeId}/customize`)
  revalidatePath("/", "layout")
  return { ok: true }
}
