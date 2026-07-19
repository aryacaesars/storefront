import "server-only"
import { prisma } from "@/lib/db/prisma"
import type { Store } from "@prisma/client"

export type { Store }

export async function getStoreBySlug(slug: string): Promise<Store | null> {
  return prisma.store.findUnique({ where: { slug } })
}

export async function getStoreById(id: string): Promise<Store | null> {
  return prisma.store.findUnique({ where: { id } })
}

export async function getStoresByOwnerId(ownerId: string): Promise<Store[]> {
  return prisma.store.findMany({
    where: { ownerId },
    orderBy: { createdAt: "asc" },
  })
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 63)
}

export async function createStore(input: {
  name: string
  slug: string
  ownerId: string
}): Promise<Store> {
  return prisma.store.create({
    data: {
      name: input.name,
      slug: input.slug,
      ownerId: input.ownerId,
    },
  })
}

export async function slugExists(slug: string): Promise<boolean> {
  const count = await prisma.store.count({ where: { slug } })
  return count > 0
}

export async function updateStoreName(id: string, name: string): Promise<Store> {
  return prisma.store.update({ where: { id }, data: { name } })
}

export async function updateStoreContact(
  id: string,
  input: {
    contactPhone?: string | null
    contactEmail?: string | null
    contactAddress?: string | null
  },
): Promise<Store> {
  return prisma.store.update({
    where: { id },
    data: {
      contactPhone: input.contactPhone,
      contactEmail: input.contactEmail,
      contactAddress: input.contactAddress,
    },
  })
}

export async function slugExistsForOtherStore(
  slug: string,
  excludeStoreId: string,
): Promise<boolean> {
  const count = await prisma.store.count({
    where: { slug, NOT: { id: excludeStoreId } },
  })
  return count > 0
}

export async function updateStoreSlug(id: string, slug: string): Promise<Store> {
  return prisma.store.update({ where: { id }, data: { slug } })
}

/**
 * Hapus toko beserta data terkait (produk, order, customer, theme, license).
 * Dipanggil dari pengaturan toko — pemilik saja.
 */
export async function deleteStore(storeId: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const productIds = (
      await tx.product.findMany({ where: { storeId }, select: { id: true } })
    ).map((p) => p.id)

    const orderIds = (
      await tx.order.findMany({ where: { storeId }, select: { id: true } })
    ).map((o) => o.id)

    const customerIds = (
      await tx.customer.findMany({ where: { storeId }, select: { id: true } })
    ).map((c) => c.id)

    if (orderIds.length > 0) {
      await tx.orderItem.deleteMany({ where: { orderId: { in: orderIds } } })
      await tx.order.deleteMany({ where: { storeId } })
    }

    if (productIds.length > 0) {
      await tx.productImage.deleteMany({ where: { productId: { in: productIds } } })
      await tx.product.deleteMany({ where: { storeId } })
    }

    await tx.category.deleteMany({ where: { storeId } })

    if (customerIds.length > 0) {
      await tx.address.deleteMany({ where: { customerId: { in: customerIds } } })
      await tx.customer.deleteMany({ where: { storeId } })
    }

    await tx.templatePurchase.deleteMany({ where: { storeId } })
    await tx.storeThemeConfig.deleteMany({ where: { storeId } })
    await tx.store.delete({ where: { id: storeId } })
  })
}
