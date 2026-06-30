"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireSession } from "@/features/auth/dal"
import { getStoreById, updateStoreName } from "@/server/services/tenant.service"
import { notFound } from "next/navigation"

const SettingsInput = z.object({
  name: z.string().trim().min(1, "Nama store wajib diisi.").max(100),
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

  const parsed = SettingsInput.safeParse({ name: formData.get("name") })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." }
  }

  await updateStoreName(storeId, parsed.data.name)
  revalidatePath(`/stores/${storeId}/settings`)
  revalidatePath("/dashboard")
  return { success: true }
}
