import "server-only"
import { prisma } from "@/lib/db/prisma"
import type { Category, Prisma, Product, ProductImage, ProductVariant } from "@prisma/client"
import {
  aggregateVariantTotals,
  buildVariantLabel,
  type ProductVariantInput,
} from "@/server/services/product-variant"

export type { Category, Product, ProductImage, ProductVariant }
export type ProductWithCategory = Product & { category: Category | null }
export type ProductWithImages = Product & {
  category: Category | null
  images: ProductImage[]
  variants: ProductVariant[]
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

export async function getProducts(storeId: string): Promise<ProductWithCategory[]> {
  return prisma.product.findMany({
    where: { storeId },
    include: { category: true },
    orderBy: { name: "asc" },
  })
}

export async function getProductById(
  id: string,
  storeId: string,
): Promise<ProductWithImages | null> {
  return prisma.product.findFirst({
    where: { id, storeId },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
    },
  })
}

async function syncProductVariants(
  productId: string,
  variants: ProductVariantInput[],
): Promise<void> {
  await prisma.productVariant.deleteMany({ where: { productId } })
  if (variants.length === 0) return

  await prisma.productVariant.createMany({
    data: variants.map((variant, index) => ({
      productId,
      sku: variant.sku?.trim() || null,
      label: buildVariantLabel(variant),
      size: variant.size?.trim() || null,
      color: variant.color?.trim() || null,
      price: variant.price,
      stock: variant.stock,
      imageUrl: variant.imageUrl?.trim() || null,
      sortOrder: index,
    })),
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
  variants?: ProductVariantInput[]
}): Promise<Product> {
  const { imageUrl, variants = [], ...data } = input
  const totals = variants.length > 0 ? aggregateVariantTotals(variants) : null

  const product = await prisma.product.create({
    data: {
      ...data,
      price: totals?.price ?? data.price,
      stock: totals?.stock ?? data.stock,
      images: imageUrl
        ? { create: { url: imageUrl, order: 0 } }
        : undefined,
    },
  })

  if (variants.length > 0) {
    await syncProductVariants(product.id, variants)
  }

  return product
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
    variants?: ProductVariantInput[]
  },
): Promise<Product> {
  const { imageUrl, variants = [], ...data } = input
  const totals = variants.length > 0 ? aggregateVariantTotals(variants) : null

  await prisma.productImage.deleteMany({ where: { productId: id } })
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      price: totals?.price ?? data.price,
      stock: totals?.stock ?? data.stock,
      images: imageUrl
        ? { create: { url: imageUrl, order: 0 } }
        : undefined,
    },
  })

  await syncProductVariants(id, variants)
  return product
}

/**
 * Sinkronkan stok agregat produk dari total stok varian. Dipakai setelah
 * stok varian berubah (checkout, restore order) agar product.stock tidak
 * drift dari sumber kebenaran (stok per varian).
 */
export async function syncProductStockFromVariants(
  tx: Prisma.TransactionClient,
  productId: string,
  storeId: string,
): Promise<void> {
  const totals = await tx.productVariant.aggregate({
    where: { productId },
    _sum: { stock: true },
  })
  await tx.product.updateMany({
    where: { id: productId, storeId },
    data: { stock: totals._sum.stock ?? 0 },
  })
}

export async function deleteProduct(id: string, storeId: string): Promise<void> {
  await prisma.productImage.deleteMany({ where: { productId: id } })
  await prisma.productVariant.deleteMany({ where: { productId: id } })
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
