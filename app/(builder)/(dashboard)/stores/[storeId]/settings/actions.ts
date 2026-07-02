"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireSession } from "@/features/auth/dal"
import {
  getStoreById,
  slugExistsForOtherStore,
  slugify,
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
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." }
  }

  const { name, slug } = parsed.data

  if (slug !== store.slug) {
    if (await slugExistsForOtherStore(slug, storeId)) {
      return { error: "Subdomain sudah dipakai store lain." }
    }
    await updateStoreSlug(storeId, slug)
  }

  await updateStoreName(storeId, name)
  revalidatePath(`/stores/${storeId}/settings`)
  revalidatePath("/dashboard")
  return { success: true }
}
