import "server-only"

import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import {
  themeConfigSchema,
  type TemplateId,
  type ThemeConfig,
} from "@/themes/engine/schema"
import { getDefaultThemeConfig } from "@/lib/themes/defaults"

function parseConfig(value: unknown): ThemeConfig | null {
  if (!value || typeof value !== "object") return null
  const parsed = themeConfigSchema.safeParse(value)
  return parsed.success ? parsed.data : null
}

function toJson(config: ThemeConfig): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(config)) as Prisma.InputJsonValue
}

async function loadRow(templateId: TemplateId) {
  return prisma.platformThemeConfig.findUnique({ where: { templateId } })
}

/** Base template: default store baru, thumbnail, dan /preview. DB → code default. */
export async function getPlatformBaseConfig(
  templateId: TemplateId,
): Promise<ThemeConfig> {
  const row = await loadRow(templateId)
  return (row ? parseConfig(row.baseConfigJson) : null) ?? getDefaultThemeConfig(templateId)
}

export async function savePlatformBaseConfig(
  templateId: TemplateId,
  config: ThemeConfig,
): Promise<void> {
  const parsed = themeConfigSchema.parse({ ...config, templateId })
  await prisma.platformThemeConfig.upsert({
    where: { templateId },
    update: { baseConfigJson: toJson(parsed) },
    create: { templateId, baseConfigJson: toJson(parsed) },
  })
}
