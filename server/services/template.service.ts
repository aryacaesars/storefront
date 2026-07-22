import "server-only"
import { prisma } from "@/lib/db/prisma"
import { templateIdSchema } from "@/themes/engine/schema"
import type { Template, TemplatePurchase } from "@prisma/client"
import type { TemplateId } from "@/themes/engine/schema"
import {
  getThemeForTenant,
  publishTheme,
  readThemeVault,
  writeThemeVault,
} from "@/server/services/theme.service"
import { getPlatformBaseConfig } from "@/server/services/platform-theme.service"

export type { Template, TemplatePurchase }
export type PurchaseWithTemplate = TemplatePurchase & { template: Template }

/** DB slug → theme engine id (mis. seed lama pakai "minimal"). */
const THEME_SLUG_ALIASES: Record<string, TemplateId> = {
  minimal: "minimalist",
}

export function normalizeThemeSlug(slug: string): TemplateId | null {
  const candidate = (THEME_SLUG_ALIASES[slug] ?? slug) as TemplateId
  const parsed = templateIdSchema.safeParse(candidate)
  return parsed.success ? parsed.data : null
}

/** theme engine id → semua slug DB yang mungkin (termasuk alias seed lama). */
function themeSlugCandidates(themeId: string): string[] {
  const aliases = Object.entries(THEME_SLUG_ALIASES)
    .filter(([, id]) => id === themeId)
    .map(([dbSlug]) => dbSlug)
  return [themeId, ...aliases]
}

export async function getPublishedTemplates(): Promise<Template[]> {
  return prisma.template.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
  })
}

export async function getTemplateById(id: string): Promise<Template | null> {
  return prisma.template.findUnique({ where: { id } })
}

export async function getPurchasesForStore(storeId: string): Promise<PurchaseWithTemplate[]> {
  return prisma.templatePurchase.findMany({
    where: { storeId },
    include: { template: true },
  })
}

export async function getPurchasedTemplateIds(storeId: string): Promise<Set<string>> {
  const purchases = await prisma.templatePurchase.findMany({
    where: { storeId, status: "PAID" },
    select: { templateId: true },
  })
  return new Set(purchases.map((p) => p.templateId))
}

/**
 * Map templateId → set of storeIds yang sudah punya license PAID.
 * Dipakai library global untuk status agregat multi-toko.
 */
export async function getPaidOwnershipByTemplate(
  storeIds: string[],
): Promise<Map<string, Set<string>>> {
  const map = new Map<string, Set<string>>()
  if (storeIds.length === 0) return map

  const rows = await prisma.templatePurchase.findMany({
    where: { storeId: { in: storeIds }, status: "PAID" },
    select: { storeId: true, templateId: true },
  })

  for (const row of rows) {
    const set = map.get(row.templateId) ?? new Set<string>()
    set.add(row.storeId)
    map.set(row.templateId, set)
  }
  return map
}

export async function getActiveTemplateId(storeId: string): Promise<string | null> {
  const config = await prisma.storeThemeConfig.findUnique({
    where: { storeId },
    select: { templateId: true },
  })
  return config?.templateId ?? null
}

export async function createPendingPurchase(input: {
  storeId: string
  templateId: string
  stripeSessionId: string
}): Promise<TemplatePurchase> {
  return prisma.templatePurchase.create({
    data: {
      storeId: input.storeId,
      templateId: input.templateId,
      stripePaymentId: input.stripeSessionId,
      status: "PENDING",
    },
  })
}

export async function markPurchasePaid(stripeSessionId: string): Promise<TemplatePurchase> {
  const purchase = await prisma.templatePurchase.findFirst({
    where: { stripePaymentId: stripeSessionId },
  })
  if (!purchase) throw new Error(`Purchase not found for session ${stripeSessionId}`)
  return prisma.templatePurchase.update({
    where: { id: purchase.id },
    data: { status: "PAID", paidAt: new Date() },
  })
}

export async function isTemplateAccessible(
  storeId: string,
  templateSlug: string,
): Promise<boolean> {
  const template = await prisma.template.findFirst({
    where: { slug: { in: themeSlugCandidates(templateSlug) } },
    select: { id: true, price: true },
  })
  if (!template) return false
  if (template.price === 0) return true
  const purchase = await prisma.templatePurchase.findFirst({
    where: { storeId, templateId: template.id, status: "PAID" },
  })
  return purchase !== null
}

export async function activateTemplate(storeId: string, templateId: string): Promise<void> {
  const [template, store, existingTheme, vaultState] = await Promise.all([
    prisma.template.findUnique({
      where: { id: templateId },
      select: { slug: true },
    }),
    prisma.store.findUnique({
      where: { id: storeId },
      select: { name: true },
    }),
    getThemeForTenant(storeId),
    readThemeVault(storeId),
  ])

  if (!store) throw new Error(`Store not found: ${storeId}`)

  const rawSlug = template?.slug ?? templateId
  let themeSlug: TemplateId | null = normalizeThemeSlug(rawSlug)
  if (!themeSlug) {
    const parsed = templateIdSchema.safeParse(rawSlug)
    if (parsed.success) themeSlug = parsed.data
  }
  if (!themeSlug) throw new Error(`Unknown theme slug: ${rawSlug}`)

  const vault = vaultState?.vault ?? { version: 1 as const, configs: {} }
  const currentId = vaultState?.activeTemplateId ?? existingTheme?.config.templateId

  if (currentId && existingTheme?.config) {
    vault.configs[currentId] = {
      ...existingTheme.config,
      storeName: store.name,
    }
  }

  const targetConfig =
    vault.configs[themeSlug] ?? (await getPlatformBaseConfig(themeSlug))

  vault.configs[themeSlug] = {
    ...targetConfig,
    templateId: themeSlug,
    storeName: store.name,
  }

  await writeThemeVault(storeId, themeSlug, vault)
}
