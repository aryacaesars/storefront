import "server-only"
import { prisma } from "@/lib/db/prisma"
import type { Template, TemplatePurchase } from "@prisma/client"

export type { Template, TemplatePurchase }
export type PurchaseWithTemplate = TemplatePurchase & { template: Template }

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
  const template = await prisma.template.findUnique({
    where: { slug: templateSlug },
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
  // templateId is Template.id (CUID) — theme engine needs the slug ("bold", "bento", etc.)
  const template = await prisma.template.findUnique({
    where: { id: templateId },
    select: { slug: true },
  })
  const themeSlug = template?.slug ?? templateId
  await prisma.storeThemeConfig.upsert({
    where: { storeId },
    update: { templateId: themeSlug },
    create: { storeId, templateId: themeSlug, configJson: {} },
  })
}
