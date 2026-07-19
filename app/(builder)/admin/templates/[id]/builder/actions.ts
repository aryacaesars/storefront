"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/features/auth/dal"
import {
  themeConfigSchema,
  type TemplateId,
  type ThemeConfig,
} from "@/themes/engine/schema"
import { savePlatformBaseConfig } from "@/server/services/platform-theme.service"

function revalidateThemeSurfaces(templateId: TemplateId) {
  revalidatePath("/admin/templates")
  revalidatePath("/stores", "layout")
  revalidatePath(`/preview/${templateId}`)
}

export async function savePlatformBaseAction(
  templateId: TemplateId,
  config: ThemeConfig,
): Promise<void> {
  await requireAdmin()
  await savePlatformBaseConfig(templateId, themeConfigSchema.parse(config))
  revalidateThemeSurfaces(templateId)
}
