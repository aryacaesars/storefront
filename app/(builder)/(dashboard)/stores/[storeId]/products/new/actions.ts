"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { requireSession } from "@/features/auth/dal"
import { getStoreById, slugify } from "@/server/services/tenant.service"
import { createProduct, productSlugExists } from "@/server/services/product.service"
import { notFound } from "next/navigation"
import type { ProductFormState } from "@/features/builder/components/ProductForm"

const ProductInput = z.object({
  name: z.string().trim().min(1, "Nama produk wajib diisi.").max(200),
  description: z.string().trim().max(2000).optional(),
  price: z.coerce.number().int().min(0, "Harga tidak boleh negatif."),
  stock: z.coerce.number().int().min(0, "Stok tidak boleh negatif."),
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
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." }
  }

  const slug = slugify(parsed.data.name)
  if (!slug) return { error: "Nama menghasilkan slug kosong." }

  if (await productSlugExists(storeId, slug)) {
    return { error: `Produk dengan nama "${parsed.data.name}" sudah ada di store ini.` }
  }

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
  })

  redirect(`/stores/${storeId}/products/${product.id}?toast=created`)
}
