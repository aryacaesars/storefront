"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { requireSession } from "@/features/auth/dal"
import {
  deleteStore,
  getStoreById,
  slugExistsForOtherStore,
  slugify,
  updateStoreContact,
  updateStoreName,
  updateStoreSlug,
} from "@/server/services/tenant.service"
import { notFound } from "next/navigation"

const SettingsInput = z.object({
  name: z.string().trim().min(1, "Store name is required.").max(100),
  slug: z
    .string()
    .trim()
    .min(1, "Subdomain is required.")
    .max(63)
    .transform((v) => slugify(v))
    .refine((v) => v.length > 0, "Invalid subdomain."),
  contactPhone: z.string().trim().max(40).optional(),
  contactEmail: z
    .string()
    .trim()
    .max(120)
    .optional()
    .refine((v) => !v || z.string().email().safeParse(v).success, "Invalid email."),
  contactAddress: z.string().trim().max(500).optional(),
})

export type SettingsState = { error: string } | { success: true } | undefined

export async function updateStoreSettingsAction(
  storeId: string,
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const parsed = SettingsInput.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    contactPhone: String(formData.get("contactPhone") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    contactAddress: String(formData.get("contactAddress") ?? ""),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  const { name, slug, contactPhone, contactEmail, contactAddress } = parsed.data

  if (slug !== store.slug) {
    if (await slugExistsForOtherStore(slug, storeId)) {
      return { error: "Subdomain is already used by another store." }
    }
    await updateStoreSlug(storeId, slug)
  }

  await updateStoreName(storeId, name)
  await updateStoreContact(storeId, {
    contactPhone: contactPhone || null,
    contactEmail: contactEmail || null,
    contactAddress: contactAddress || null,
  })

  revalidatePath(`/stores/${storeId}/settings`)
  revalidatePath(`/stores/${storeId}/dashboard`)
  revalidatePath("/dashboard")
  return { success: true }
}

export type DeleteStoreState = { error: string } | undefined

export async function deleteStoreAction(
  storeId: string,
  _prev: DeleteStoreState,
  formData: FormData,
): Promise<DeleteStoreState> {
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const confirm = String(formData.get("confirmName") ?? "").trim()
  if (confirm !== store.name) {
    return { error: "Store name does not match. Type the exact store name to confirm." }
  }

  try {
    await deleteStore(storeId)
  } catch (err) {
    console.error("[settings] deleteStore failed:", err)
    return { error: "Failed to delete store. Please try again." }
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}
