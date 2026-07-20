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
  name: z.string().trim().min(1, "Category name is required.").max(100),
})

export type CategoryState = { error: string } | { success: true } | undefined

export type DeleteCategoryResult = { ok: true } | { ok: false; error: string }

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
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const slug = slugify(parsed.data.name)
  if (!slug) return { error: "Name produces an empty slug. Use a different name." }

  if (await categorySlugExists(storeId, slug)) {
    return { error: `Category "${parsed.data.name}" already exists.` }
  }

  await createCategory({ name: parsed.data.name, slug, storeId })
  revalidatePath(`/stores/${storeId}/categories`)
  return { success: true }
}

export async function deleteCategoryAction(
  storeId: string,
  categoryId: string,
): Promise<DeleteCategoryResult> {
  await requireOwner(storeId)
  try {
    await deleteCategory(categoryId, storeId)
    revalidatePath(`/stores/${storeId}/categories`)
    return { ok: true }
  } catch {
    return { ok: false, error: "Failed to delete category." }
  }
}
