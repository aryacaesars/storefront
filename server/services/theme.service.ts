import "server-only"

import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import {
  themeConfigSchema,
  templateIdSchema,
  type ThemeConfig,
  type TemplateId,
} from "@/themes/engine/schema"

function parseThemeConfig(json: unknown): ThemeConfig | null {
  const result = themeConfigSchema.safeParse(json)
  return result.success ? result.data : null
}

function toJsonConfig(config: ThemeConfig): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(config)) as Prisma.InputJsonValue
}

export async function getPublishedThemeBySlug(
  slug: string,
): Promise<ThemeConfig | null> {
  const row = await prisma.themeConfig.findFirst({
    where: {
      isPublished: true,
      tenant: { slug },
    },
    select: { config: true },
  })

  if (!row) return null
  return parseThemeConfig(row.config)
}

export async function getThemeForTenant(
  tenantId: string,
): Promise<{ config: ThemeConfig; isPublished: boolean } | null> {
  const row = await prisma.themeConfig.findUnique({
    where: { tenantId },
    select: { config: true, isPublished: true },
  })

  if (!row) return null

  const config = parseThemeConfig(row.config)
  if (!config) return null

  return { config, isPublished: row.isPublished }
}

export async function getActiveTemplateIdForTenant(
  tenantId: string,
): Promise<TemplateId | null> {
  const row = await prisma.themeConfig.findUnique({
    where: { tenantId },
    select: { templateId: true },
  })

  if (!row) return null

  const parsed = templateIdSchema.safeParse(row.templateId)
  return parsed.success ? parsed.data : null
}

export async function saveThemeDraft(
  tenantId: string,
  config: ThemeConfig,
): Promise<void> {
  const parsed = themeConfigSchema.parse(config)

  await prisma.themeConfig.upsert({
    where: { tenantId },
    create: {
      tenantId,
      templateId: parsed.templateId,
      config: toJsonConfig(parsed),
      isPublished: false,
    },
    update: {
      templateId: parsed.templateId,
      config: toJsonConfig(parsed),
      isPublished: false,
    },
  })
}

export async function publishTheme(
  tenantId: string,
  config: ThemeConfig,
): Promise<void> {
  const parsed = themeConfigSchema.parse(config)

  await prisma.themeConfig.upsert({
    where: { tenantId },
    create: {
      tenantId,
      templateId: parsed.templateId,
      config: toJsonConfig(parsed),
      isPublished: true,
    },
    update: {
      templateId: parsed.templateId,
      config: toJsonConfig(parsed),
      isPublished: true,
    },
  })
}
