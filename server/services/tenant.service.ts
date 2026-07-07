import "server-only"
import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import type { Store } from "@prisma/client"
import { getDefaultThemeConfig } from "@/lib/themes/defaults"
import type { ThemeConfig } from "@/themes/engine/schema"

function toJsonConfig(config: ThemeConfig): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(config)) as Prisma.InputJsonValue
}

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
  const defaultConfig = {
    ...getDefaultThemeConfig("minimalist"),
    storeName: input.name,
  }

  return prisma.store.create({
    data: {
      name: input.name,
      slug: input.slug,
      ownerId: input.ownerId,
      themeConfig: {
        create: {
          templateId: "minimalist",
          configJson: toJsonConfig(defaultConfig),
        },
      },
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
