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
