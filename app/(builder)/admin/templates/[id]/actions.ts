"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdmin } from "@/features/auth/dal"
import { updateTemplate, deleteTemplate } from "@/server/services/admin.service"
import type { TemplateFormState } from "../form-state"

const Input = z.object({
  name: z.string().trim().min(1, "Name is required."),
  description: z.string().trim().optional(),
  price: z.coerce.number().min(0, "Invalid price."),
  previewUrl: z.string().optional(),
  published: z.boolean(),
})

export async function updateTemplateAction(
  id: string,
  _prev: TemplateFormState,
  formData: FormData,
): Promise<TemplateFormState> {
  await requireAdmin()
  const parsed = Input.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    price: formData.get("price"),
    previewUrl: (formData.get("previewUrl") as string) || undefined,
    published: formData.get("published") === "on",
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." }

  await updateTemplate(id, {
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    price: Math.round(parsed.data.price),
    previewUrl: parsed.data.previewUrl ?? null,
    published: parsed.data.published,
  })

  revalidatePath("/admin/templates")
  revalidatePath(`/admin/templates/${id}`)
  redirect("/admin/templates")
}

export async function deleteTemplateAction(id: string, _formData: FormData): Promise<void> {
  await requireAdmin()
  const result = await deleteTemplate(id)
  if (!result.ok) {
    redirect(`/admin/templates/${id}?error=${encodeURIComponent(result.error)}`)
  }
  revalidatePath("/admin/templates")
  redirect("/admin/templates")
}
