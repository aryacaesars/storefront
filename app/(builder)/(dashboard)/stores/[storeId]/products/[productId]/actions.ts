"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireSession } from "@/features/auth/dal"
import { getStoreById, slugify } from "@/server/services/tenant.service"
import {
  updateProduct,
  deleteProduct,
  productSlugExists,
} from "@/server/services/product.service"
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

async function requireOwner(storeId: string) {
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()
  return store
}

export async function updateProductAction(
  storeId: string,
  productId: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireOwner(storeId)

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

  if (await productSlugExists(storeId, slug, productId)) {
    return { error: `Produk lain dengan nama "${parsed.data.name}" sudah ada.` }
  }

  await updateProduct(productId, storeId, {
    name: parsed.data.name,
    slug,
    description: parsed.data.description || null,
    price: parsed.data.price,
    stock: parsed.data.stock,
    published: parsed.data.published === "on",
    categoryId: parsed.data.categoryId || null,
    imageUrl: parsed.data.imageUrl || null,
  })

  revalidatePath(`/stores/${storeId}/products`)
  return { success: true }
}

export type DeleteProductResult = { ok: true } | { ok: false; error: string }

export async function deleteProductAction(
  storeId: string,
  productId: string,
): Promise<DeleteProductResult> {
  await requireOwner(storeId)
  try {
    await deleteProduct(productId, storeId)
    revalidatePath(`/stores/${storeId}/products`)
    return { ok: true }
  } catch {
    return { ok: false, error: "Gagal menghapus produk." }
  }
}
