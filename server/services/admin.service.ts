import "server-only"
import { prisma } from "@/lib/db/prisma"
import { slugify } from "@/server/services/tenant.service"
import type { Template } from "@prisma/client"

export type AdminOverview = {
  totalStores: number
  totalTemplates: number
  publishedTemplates: number
  totalPurchases: number
  revenueTotal: number // dalam sen (cents), jumlah harga template yang PAID
}

/** Ringkasan platform untuk dashboard admin. */
export async function getAdminOverview(): Promise<AdminOverview> {
  const [totalStores, totalTemplates, publishedTemplates, paidPurchases] =
    await Promise.all([
      prisma.store.count(),
      prisma.template.count(),
      prisma.template.count({ where: { published: true } }),
      prisma.templatePurchase.findMany({
        where: { status: "PAID" },
        select: { template: { select: { price: true } } },
      }),
    ])

  const revenueTotal = paidPurchases.reduce((sum, p) => sum + p.template.price, 0)

  return {
    totalStores,
    totalTemplates,
    publishedTemplates,
    totalPurchases: paidPurchases.length,
    revenueTotal,
  }
}

export type StoreAdminRow = {
  id: string
  name: string
  slug: string
  createdAt: Date
  ownerEmail: string
  ownerName: string | null
  productCount: number
  orderCount: number
}

/** Semua tenant aktif di platform. */
export async function getAllStoresAdmin(): Promise<StoreAdminRow[]> {
  const stores = await prisma.store.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { email: true, name: true } },
      _count: { select: { products: true, orders: true } },
    },
  })

  return stores.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    createdAt: s.createdAt,
    ownerEmail: s.owner.email,
    ownerName: s.owner.name,
    productCount: s._count.products,
    orderCount: s._count.orders,
  }))
}

export type PurchaseAdminRow = {
  id: string
  status: string
  paidAt: Date | null
  createdAt: Date
  storeName: string
  storeSlug: string
  templateName: string
  price: number
}

/** Semua transaksi pembelian template (siapa beli apa, status). */
export async function getAllPurchasesAdmin(): Promise<PurchaseAdminRow[]> {
  const purchases = await prisma.templatePurchase.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      store: { select: { name: true, slug: true } },
      template: { select: { name: true, price: true } },
    },
  })

  return purchases.map((p) => ({
    id: p.id,
    status: p.status,
    paidAt: p.paidAt,
    createdAt: p.createdAt,
    storeName: p.store.name,
    storeSlug: p.store.slug,
    templateName: p.template.name,
    price: p.template.price,
  }))
}

export type TemplateAdminRow = Template & { purchaseCount: number }

/** Semua template marketplace + jumlah pembelian PAID. */
export async function getAllTemplatesAdmin(): Promise<TemplateAdminRow[]> {
  const templates = await prisma.template.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { purchases: { where: { status: "PAID" } } } } },
  })

  return templates.map((t) => {
    const { _count, ...rest } = t
    return { ...rest, purchaseCount: _count.purchases }
  })
}

/** Slug unik dari nama (tambah sufiks angka kalau bentrok). */
async function uniqueTemplateSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || "template"
  let slug = base
  let n = 1
  while (true) {
    const existing = await prisma.template.findUnique({ where: { slug }, select: { id: true } })
    if (!existing || existing.id === excludeId) return slug
    n += 1
    slug = `${base}-${n}`
  }
}

export type TemplateInput = {
  name: string
  description: string | null
  price: number // dalam sen
  previewUrl: string | null
  published: boolean
}

export async function createTemplate(input: TemplateInput): Promise<Template> {
  const slug = await uniqueTemplateSlug(input.name)
  return prisma.template.create({
    data: {
      name: input.name,
      slug,
      description: input.description,
      price: input.price,
      previewUrl: input.previewUrl,
      published: input.published,
    },
  })
}

export async function updateTemplate(id: string, input: TemplateInput): Promise<Template> {
  const slug = await uniqueTemplateSlug(input.name, id)
  return prisma.template.update({
    where: { id },
    data: {
      name: input.name,
      slug,
      description: input.description,
      price: input.price,
      previewUrl: input.previewUrl,
      published: input.published,
    },
  })
}

export async function setTemplatePublished(id: string, published: boolean): Promise<void> {
  await prisma.template.update({ where: { id }, data: { published } })
}

export type DeleteTemplateResult = { ok: true } | { ok: false; error: string }

/** Hapus template. Ditolak kalau sudah ada pembelian (jaga integritas FK + histori). */
export async function deleteTemplate(id: string): Promise<DeleteTemplateResult> {
  const count = await prisma.templatePurchase.count({ where: { templateId: id } })
  if (count > 0) {
    return { ok: false, error: "Template sudah pernah dibeli, tidak bisa dihapus." }
  }
  await prisma.template.delete({ where: { id } })
  return { ok: true }
}
