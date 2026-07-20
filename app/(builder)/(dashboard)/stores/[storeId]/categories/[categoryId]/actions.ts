"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireSession } from "@/features/auth/dal"
import { getStoreById, slugify } from "@/server/services/tenant.service"
import {
  updateCategory,
  deleteCategory,
  categorySlugExists,
} from "@/server/services/product.service"
import { notFound } from "next/navigation"
import type { CategoryFormState } from "@/features/builder/components/CategoryForm"

const CategoryInput = z.object({
  name: z.string().trim().min(1, "Category name is required.").max(100),
})

async function requireOwner(storeId: string) {
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()
  return store
}

export type DeleteCategoryResult = { ok: true } | { ok: false; error: string }

export async function updateCategoryAction(
  storeId: string,
  categoryId: string,
  _prev: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireOwner(storeId)

  const parsed = CategoryInput.safeParse({ name: formData.get("name") })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." }

  const slug = slugify(parsed.data.name)
  if (!slug) return { error: "Name produces an empty slug. Use a different name." }

  if (await categorySlugExists(storeId, slug, categoryId)) {
    return { error: `Category "${parsed.data.name}" already exists.` }
  }

  await updateCategory(categoryId, storeId, {
    name: parsed.data.name,
    slug,
  })

  revalidatePath(`/stores/${storeId}/categories`)
  revalidatePath(`/stores/${storeId}/categories/${categoryId}`)
  revalidatePath(`/stores/${storeId}/products`)
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
    revalidatePath(`/stores/${storeId}/products`)
    return { ok: true }
  } catch {
    return { ok: false, error: "Failed to delete category." }
  }
}
