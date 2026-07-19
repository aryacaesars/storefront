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

export type ThemeConfigVault = {
  version: 1
  configs: Partial<Record<TemplateId, ThemeConfig>>
}

function toJsonVault(vault: ThemeConfigVault): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(vault)) as Prisma.InputJsonValue
}

function withStoreName(config: ThemeConfig, storeName: string): ThemeConfig {
  return { ...config, storeName }
}

function parseStoredConfig(value: unknown, storeName?: string): ThemeConfig | null {
  if (!value || typeof value !== "object") return null
  const obj = value as Record<string, unknown>
  const resolvedName =
    storeName && storeName.length > 0
      ? storeName
      : typeof obj.storeName === "string" && obj.storeName.length > 0
        ? obj.storeName
        : "Store"
  const merged = { ...obj, storeName: resolvedName }
  const parsed = themeConfigSchema.safeParse(merged)
  return parsed.success ? parsed.data : null
}

export function parseThemeVault(
  configJson: unknown,
  fallbackTemplateId: TemplateId,
): ThemeConfigVault {
  if (!configJson || typeof configJson !== "object") {
    return { version: 1, configs: {} }
  }

  const raw = configJson as Record<string, unknown>

  if (raw.version === 1 && raw.configs && typeof raw.configs === "object") {
    const configs: Partial<Record<TemplateId, ThemeConfig>> = {}
    for (const [key, value] of Object.entries(raw.configs as Record<string, unknown>)) {
      const idParsed = templateIdSchema.safeParse(key)
      if (!idParsed.success) continue
      const config = parseStoredConfig(value)
      if (config) configs[idParsed.data] = config
    }
    return { version: 1, configs }
  }

  const flat = parseStoredConfig(configJson)
  if (flat) {
    return { version: 1, configs: { [flat.templateId]: flat } }
  }

  return { version: 1, configs: {} }
}

async function loadStoreThemeRow(storeId: string) {
  return prisma.storeThemeConfig.findUnique({
    where: { storeId },
    include: { store: { select: { name: true } } },
  })
}

export async function readThemeVault(storeId: string): Promise<{
  vault: ThemeConfigVault
  activeTemplateId: TemplateId | null
  storeName: string
} | null> {
  const row = await loadStoreThemeRow(storeId)
  if (!row) return null

  const activeParsed = templateIdSchema.safeParse(row.templateId)
  const activeTemplateId = activeParsed.success ? activeParsed.data : null
  const fallback = activeTemplateId ?? "minimalist"
  const vault = parseThemeVault(row.configJson, fallback)

  return { vault, activeTemplateId, storeName: row.store.name }
}

export async function writeThemeVault(
  storeId: string,
  activeTemplateId: TemplateId,
  vault: ThemeConfigVault,
): Promise<void> {
  const json = toJsonVault(vault)
  await prisma.storeThemeConfig.upsert({
    where: { storeId },
    update: { configJson: json, templateId: activeTemplateId },
    create: { storeId, configJson: json, templateId: activeTemplateId },
  })
}

function getConfigFromVault(
  vault: ThemeConfigVault,
  templateId: TemplateId,
  storeName: string,
): ThemeConfig | null {
  const stored = vault.configs[templateId]
  if (!stored) return null
  return withStoreName(stored, storeName)
}

/** First-time activation only — full default config for a template. */
export function buildInitialThemeConfig(
  themeSlug: TemplateId,
  storeName: string,
): ThemeConfig {
  return {
    ...getDefaultThemeConfig(themeSlug),
    templateId: themeSlug,
    storeName,
  }
}

/** @deprecated Use buildInitialThemeConfig — kept for imports during transition */
export const buildActivatedThemeConfig = buildInitialThemeConfig

export async function getThemeConfigForStore(
  storeId: string,
  templateId: TemplateId,
): Promise<ThemeConfig | null> {
  const state = await readThemeVault(storeId)
  if (!state) return null
  return getConfigFromVault(state.vault, templateId, state.storeName)
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
  const vault = parseThemeVault(store.themeConfig.configJson, templateId)
  const config = getConfigFromVault(vault, templateId, store.name)
  const base = config ?? getDefaultThemeConfig(templateId)
  return {
    ...base,
    storeName: store.name,
    contactPhone: store.contactPhone || base.contactPhone,
    contactEmail: store.contactEmail || base.contactEmail,
    contactAddress: store.contactAddress || base.contactAddress,
  }
}

export async function getThemeForTenant(
  storeId: string,
): Promise<{ config: ThemeConfig; isPublished: boolean } | null> {
  const state = await readThemeVault(storeId)
  if (!state?.activeTemplateId) return null

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: {
      name: true,
      contactPhone: true,
      contactEmail: true,
      contactAddress: true,
    },
  })

  const config =
    getConfigFromVault(state.vault, state.activeTemplateId, state.storeName) ??
    getDefaultThemeConfig(state.activeTemplateId)

  return {
    config: {
      ...config,
      storeName: store?.name ?? config.storeName,
      contactPhone: store?.contactPhone || config.contactPhone,
      contactEmail: store?.contactEmail || config.contactEmail,
      contactAddress: store?.contactAddress || config.contactAddress,
    },
    isPublished: true,
  }
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
  const state = await readThemeVault(storeId)

  const vault = state?.vault ?? { version: 1 as const, configs: {} }
  const activeTemplateId = state?.activeTemplateId ?? parsed.templateId
  const storeName = state?.storeName ?? parsed.storeName

  vault.configs[parsed.templateId] = withStoreName(parsed, storeName)
  await writeThemeVault(storeId, activeTemplateId, vault)
}

export async function publishTheme(
  storeId: string,
  config: ThemeConfig,
): Promise<void> {
  const parsed = themeConfigSchema.parse(config)
  const state = await readThemeVault(storeId)

  const vault = state?.vault ?? { version: 1 as const, configs: {} }
  const storeName = state?.storeName ?? parsed.storeName

  vault.configs[parsed.templateId] = withStoreName(parsed, storeName)
  await writeThemeVault(storeId, parsed.templateId, vault)
}
