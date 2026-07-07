import "server-only"
import { prisma } from "@/lib/db/prisma"
import type { Category, Product, ProductImage } from "@prisma/client"

export type { Category, Product, ProductImage }
export type ProductWithCategory = Product & { category: Category | null }
export type ProductListItem = Product & {
  category: Category | null
  images: ProductImage[]
}
export type ProductWithImages = Product & {
  category: Category | null
  images: ProductImage[]
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(storeId: string): Promise<Category[]> {
  return prisma.category.findMany({
    where: { storeId },
    orderBy: { name: "asc" },
  })
}

export type CategoryWithProductCount = Category & { _count: { products: number } }

export async function getCategoriesWithCounts(
  storeId: string,
): Promise<CategoryWithProductCount[]> {
  return prisma.category.findMany({
    where: { storeId },
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  })
}

export async function getCategoryById(
  id: string,
  storeId: string,
): Promise<CategoryWithProductCount | null> {
  return prisma.category.findFirst({
    where: { id, storeId },
    include: { _count: { select: { products: true } } },
  })
}

export async function createCategory(input: {
  name: string
  slug: string
  storeId: string
}): Promise<Category> {
  return prisma.category.create({ data: input })
}

export async function updateCategory(
  id: string,
  storeId: string,
  input: { name: string; slug: string },
): Promise<Category> {
  return prisma.category.update({
    where: { id },
    data: { name: input.name, slug: input.slug },
  })
}

export async function deleteCategory(id: string, storeId: string): Promise<void> {
  await prisma.category.deleteMany({ where: { id, storeId } })
}

export async function categorySlugExists(
  storeId: string,
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const count = await prisma.category.count({
    where: { storeId, slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
  })
  return count > 0
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(
  storeId: string,
  options?: { search?: string },
): Promise<ProductListItem[]> {
  const search = options?.search?.trim()

  return prisma.product.findMany({
    where: {
      storeId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { slug: { contains: search, mode: "insensitive" } },
              { category: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      category: true,
      images: { orderBy: { order: "asc" }, take: 1 },
    },
    orderBy: { name: "asc" },
  })
}

export async function getProductById(
  id: string,
  storeId: string,
): Promise<ProductWithImages | null> {
  return prisma.product.findFirst({
    where: { id, storeId },
    include: { category: true, images: { orderBy: { order: "asc" } } },
  })
}

export async function createProduct(input: {
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  published: boolean
  storeId: string
  categoryId: string | null
  imageUrl: string | null
}): Promise<Product> {
  const { imageUrl, ...data } = input
  return prisma.product.create({
    data: {
      ...data,
      images: imageUrl
        ? { create: { url: imageUrl, order: 0 } }
        : undefined,
    },
  })
}

export async function updateProduct(
  id: string,
  storeId: string,
  input: {
    name: string
    slug: string
    description: string | null
    price: number
    stock: number
    published: boolean
    categoryId: string | null
    imageUrl: string | null
  },
): Promise<Product> {
  const { imageUrl, ...data } = input
  await prisma.productImage.deleteMany({ where: { productId: id } })
  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      images: imageUrl
        ? { create: { url: imageUrl, order: 0 } }
        : undefined,
    },
  })
}

export async function deleteProduct(id: string, storeId: string): Promise<void> {
  await prisma.productImage.deleteMany({ where: { productId: id } })
  await prisma.product.deleteMany({ where: { id, storeId } })
}

export async function productSlugExists(
  storeId: string,
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const count = await prisma.product.count({
    where: { storeId, slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
  })
  return count > 0
}
