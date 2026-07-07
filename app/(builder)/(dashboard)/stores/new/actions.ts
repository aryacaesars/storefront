"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { requireSession } from "@/features/auth/dal"
import {
  createStore,
  slugExists,
} from "@/server/services/tenant.service"

const CreateStoreInput = z.object({
  name: z.string().trim().min(1, "Nama store wajib diisi.").max(100, "Nama terlalu panjang."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug minimal 2 karakter.")
    .max(63, "Slug maksimal 63 karakter.")
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Slug hanya huruf kecil, angka, dan tanda hubung. Tidak boleh diawali atau diakhiri tanda hubung."),
})

export type CreateStoreState = { error: string } | undefined

export async function createStoreAction(
  _prev: CreateStoreState,
  formData: FormData,
): Promise<CreateStoreState> {
  const session = await requireSession()

  const parsed = CreateStoreInput.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." }
  }

  const { name, slug } = parsed.data

  if (await slugExists(slug)) {
    return { error: `Slug "${slug}" sudah digunakan. Pilih slug lain.` }
  }

  const store = await createStore({ name, slug, ownerId: session.userId })

  revalidatePath("/dashboard")
  revalidatePath("/", "layout")

  redirect(`/stores/${store.id}/dashboard`)
}
