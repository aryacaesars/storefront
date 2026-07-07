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

export async function publishThemeForStore(
  storeId: string,
  config: ThemeConfig,
): Promise<void> {
  await requireStoreOwner(storeId)
  const parsed = themeConfigSchema.parse(config)
  const canPublish = await isTemplateAccessible(storeId, parsed.templateId)
  if (!canPublish) {
    throw new Error("PAYMENT_REQUIRED")
  }
  await publishThemeToDb(storeId, parsed)
  revalidatePath(`/stores/${storeId}/customize`)
  revalidatePath("/", "layout")
}
