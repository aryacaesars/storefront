import "server-only"

// TODO Sprint 2: reconnect to Prisma data source — prisma.themeConfig does not exist in new schema
// Rewrite using prisma.store or a new ThemeConfig model when schema is updated.

import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import {
  themeConfigSchema,
  templateIdSchema,
  type ThemeConfig,
  type TemplateId,
} from "@/themes/engine/schema"

// Suppress unused import warning during Sprint 1 stub
void prisma

function parseThemeConfig(json: unknown): ThemeConfig | null {
  const result = themeConfigSchema.safeParse(json)
  return result.success ? result.data : null
}

function toJsonConfig(config: ThemeConfig): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(config)) as Prisma.InputJsonValue
}

// TODO Sprint 2: reconnect to Prisma data source
export async function getPublishedThemeBySlug(
  _slug: string,
): Promise<ThemeConfig | null> {
  // prisma.themeConfig removed — needs new schema
  return null
}

// TODO Sprint 2: reconnect to Prisma data source
export async function getThemeForTenant(
  _tenantId: string,
): Promise<{ config: ThemeConfig; isPublished: boolean } | null> {
  // prisma.themeConfig removed — needs new schema
  return null
}

// TODO Sprint 2: reconnect to Prisma data source
export async function getActiveTemplateIdForTenant(
  _tenantId: string,
): Promise<TemplateId | null> {
  // prisma.themeConfig removed — needs new schema
  return null
}

// TODO Sprint 2: reconnect to Prisma data source
export async function saveThemeDraft(
  _tenantId: string,
  config: ThemeConfig,
): Promise<void> {
  // prisma.themeConfig removed — needs new schema
  const _parsed = themeConfigSchema.parse(config)
  const _json = toJsonConfig(_parsed)
  return
}

// TODO Sprint 2: reconnect to Prisma data source
export async function publishTheme(
  _tenantId: string,
  config: ThemeConfig,
): Promise<void> {
  // prisma.themeConfig removed — needs new schema
  const _parsed = themeConfigSchema.parse(config)
  const _json = toJsonConfig(_parsed)
  return
}
