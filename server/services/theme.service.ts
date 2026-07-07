import "server-only"

import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import {
  themeConfigSchema,
  templateIdSchema,
  type ThemeConfig,
  type TemplateId,
} from "@/themes/engine/schema"
import { getDefaultThemeConfig } from "@/lib/themes/defaults"

function toJsonConfig(config: ThemeConfig): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(config)) as Prisma.InputJsonValue
}

export async function getPublishedThemeBySlug(
  slug: string,
): Promise<ThemeConfig | null> {
  const store = await prisma.store.findUnique({
    where: { slug },
    include: { themeConfig: true },
  })
  if (!store?.themeConfig) return null

  const parsedTemplateId = templateIdSchema.safeParse(store.themeConfig.templateId)
  if (!parsedTemplateId.success) return null

  const templateId = parsedTemplateId.data
  const configJson = store.themeConfig.configJson

  const merged = {
    templateId,
    storeName: store.name,
    ...(typeof configJson === "object" && configJson !== null ? configJson : {}),
  }
  const parsed = themeConfigSchema.safeParse(merged)
  return parsed.success ? parsed.data : getDefaultThemeConfig(templateId)
}

export async function getThemeForTenant(
  storeId: string,
): Promise<{ config: ThemeConfig; isPublished: boolean } | null> {
  const themeConfig = await prisma.storeThemeConfig.findUnique({
    where: { storeId },
    include: { store: { select: { name: true } } },
  })
  if (!themeConfig) return null

  const parsedTemplateId = templateIdSchema.safeParse(themeConfig.templateId)
  if (!parsedTemplateId.success) return null

  const templateId = parsedTemplateId.data
  const configJson = themeConfig.configJson

  const merged = {
    templateId,
    storeName: themeConfig.store.name,
    ...(typeof configJson === "object" && configJson !== null ? configJson : {}),
  }
  const parsed = themeConfigSchema.safeParse(merged)
  const config = parsed.success ? parsed.data : getDefaultThemeConfig(templateId)

  return { config, isPublished: true }
}

export async function getActiveTemplateIdForTenant(
  storeId: string,
): Promise<TemplateId | null> {
  const config = await prisma.storeThemeConfig.findUnique({
    where: { storeId },
    select: { templateId: true },
  })
  if (!config) return null
  const parsed = templateIdSchema.safeParse(config.templateId)
  return parsed.success ? parsed.data : null
}

export async function saveThemeDraft(
  storeId: string,
  config: ThemeConfig,
): Promise<void> {
  const parsed = themeConfigSchema.parse(config)
  const json = toJsonConfig(parsed)
  await prisma.storeThemeConfig.update({
    where: { storeId },
    data: { configJson: json },
  })
}

export async function publishTheme(
  storeId: string,
  config: ThemeConfig,
): Promise<void> {
  const parsed = themeConfigSchema.parse(config)
  const json = toJsonConfig(parsed)
  await prisma.storeThemeConfig.update({
    where: { storeId },
    data: { configJson: json, templateId: parsed.templateId },
  })
}
