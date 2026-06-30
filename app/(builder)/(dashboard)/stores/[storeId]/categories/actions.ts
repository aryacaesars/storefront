"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireSession } from "@/features/auth/dal"
import { getStoreById, slugify } from "@/server/services/tenant.service"
import {
  createCategory,
  deleteCategory,
  categorySlugExists,
} from "@/server/services/product.service"
import { notFound } from "next/navigation"

const CategoryInput = z.object({
  name: z.string().trim().min(1, "Nama kategori wajib diisi.").max(100),
})

export type CategoryState = { error: string } | undefined

async function requireOwner(storeId: string) {
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()
  return store
}

export async function createCategoryAction(
  storeId: string,
  _prev: CategoryState,
  formData: FormData,
): Promise<CategoryState> {
  await requireOwner(storeId)

  const parsed = CategoryInput.safeParse({ name: formData.get("name") })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." }

  const slug = slugify(parsed.data.name)
  if (!slug) return { error: "Nama menghasilkan slug kosong. Gunakan nama lain." }

  if (await categorySlugExists(storeId, slug)) {
    return { error: `Kategori "${parsed.data.name}" sudah ada.` }
  }

  await createCategory({ name: parsed.data.name, slug, storeId })
  revalidatePath(`/stores/${storeId}/categories`)
}

export async function deleteCategoryAction(
  storeId: string,
  categoryId: string,
): Promise<void> {
  await requireOwner(storeId)
  await deleteCategory(categoryId, storeId)
  revalidatePath(`/stores/${storeId}/categories`)
}
