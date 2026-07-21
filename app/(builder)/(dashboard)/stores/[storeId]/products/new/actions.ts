"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { requireSession } from "@/features/auth/dal"
import { getStoreById, slugify } from "@/server/services/tenant.service"
import { createProduct, productSlugExists } from "@/server/services/product.service"
import { parseVariantsJson } from "@/server/services/product-variant"
import { notFound } from "next/navigation"
import type { ProductFormState } from "@/features/builder/components/ProductForm"

const ProductInput = z.object({
  name: z.string().trim().min(1, "Product name is required.").max(200),
  description: z.string().trim().max(2000).optional(),
  price: z.coerce.number().int().min(0, "Price cannot be negative."),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
  categoryId: z.string().optional(),
  imageUrl: z.string().optional(),
  published: z.string().optional(),
})

export async function createProductAction(
  storeId: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    imageUrl: formData.get("imageUrl"),
    published: formData.get("published"),
  }

  const parsed = ProductInput.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  const slug = slugify(parsed.data.name)
  if (!slug) return { error: "Name produces an empty slug." }

  if (await productSlugExists(storeId, slug)) {
    return { error: `A product named "${parsed.data.name}" already exists in this store.` }
  }

  const variants = parseVariantsJson(formData.get("variantsJson"))

  // Main image dibiarkan null saat kosong — thumbnail fallback ke gambar varian
  // dihitung live saat render katalog, bukan disnapshot di sini (agar ganti
  // gambar varian ikut mengubah thumbnail).
  const product = await createProduct({
    name: parsed.data.name,
    slug,
    description: parsed.data.description || null,
    price: parsed.data.price,
    stock: parsed.data.stock,
    published: parsed.data.published === "on",
    storeId,
    categoryId: parsed.data.categoryId || null,
    imageUrl: parsed.data.imageUrl || null,
    variants,
  })

  redirect(`/stores/${storeId}/products/${product.id}?toast=created`)
}
