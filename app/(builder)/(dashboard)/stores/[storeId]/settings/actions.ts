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
  name: z.string().trim().min(1, "Nama store wajib diisi.").max(100),
  slug: z
    .string()
    .trim()
    .min(1, "Subdomain wajib diisi.")
    .max(63)
    .transform((v) => slugify(v))
    .refine((v) => v.length > 0, "Subdomain tidak valid."),
  contactPhone: z.string().trim().max(40).optional(),
  contactEmail: z
    .string()
    .trim()
    .max(120)
    .optional()
    .refine((v) => !v || z.string().email().safeParse(v).success, "Email tidak valid."),
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
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." }
  }

  const { name, slug, contactPhone, contactEmail, contactAddress } = parsed.data

  if (slug !== store.slug) {
    if (await slugExistsForOtherStore(slug, storeId)) {
      return { error: "Subdomain sudah dipakai store lain." }
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
    return { error: "Nama toko tidak cocok. Ketik nama toko persis untuk konfirmasi." }
  }

  try {
    await deleteStore(storeId)
  } catch (err) {
    console.error("[settings] deleteStore failed:", err)
    return { error: "Gagal menghapus toko. Coba lagi." }
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}
