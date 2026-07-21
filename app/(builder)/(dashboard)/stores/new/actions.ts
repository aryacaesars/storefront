"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { requireSession } from "@/features/auth/dal"
import {
  createStore,
  slugExists,
} from "@/server/services/tenant.service"

const CreateStoreInput = z.object({
  name: z.string().trim().min(1, "Store name is required.").max(100, "Name is too long."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters.")
    .max(63, "Slug must be at most 63 characters.")
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Slug must use lowercase letters, numbers, and hyphens only. It cannot start or end with a hyphen."),
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
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  const { name, slug } = parsed.data

  if (await slugExists(slug)) {
    return { error: `Slug "${slug}" is already taken. Choose another slug.` }
  }

  await createStore({ name, slug, ownerId: session.userId })

  redirect("/templates")
}
