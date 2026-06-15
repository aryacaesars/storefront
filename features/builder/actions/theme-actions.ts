"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { getSession } from "@/features/auth/dal"
import { templateIdSchema, themeConfigSchema, type ThemeConfig } from "@/themes/engine/schema"
import {
  publishTheme as publishThemeToDb,
  saveThemeDraft as saveThemeDraftToDb,
} from "@/server/services/theme.service"

const ACTIVE_TEMPLATE_COOKIE = "active-template"
const THEME_DRAFT_COOKIE = "theme-draft"

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
}

async function requireTenantSession() {
  const session = await getSession()
  if (!session) throw new Error("Unauthorized")
  return session
}

export async function activateTemplate(formData: FormData) {
  await requireTenantSession()
  const templateId = templateIdSchema.parse(formData.get("templateId"))
  const cookieStore = await cookies()

  cookieStore.set(ACTIVE_TEMPLATE_COOKIE, templateId, cookieOptions)
  cookieStore.delete(THEME_DRAFT_COOKIE)

  revalidatePath("/dashboard")
  revalidatePath("/templates")
  revalidatePath("/customize")
  revalidatePath("/", "layout")
}

export async function saveThemeDraft(config: ThemeConfig) {
  const session = await requireTenantSession()
  const parsed = themeConfigSchema.parse(config)
  const cookieStore = await cookies()

  await saveThemeDraftToDb(session.tenantId, parsed)

  cookieStore.set(ACTIVE_TEMPLATE_COOKIE, parsed.templateId, cookieOptions)
  cookieStore.set(THEME_DRAFT_COOKIE, JSON.stringify(parsed), cookieOptions)

  revalidatePath("/dashboard")
  revalidatePath("/customize")
}

export async function publishTheme(config: ThemeConfig) {
  const session = await requireTenantSession()
  const parsed = themeConfigSchema.parse(config)
  const cookieStore = await cookies()

  await publishThemeToDb(session.tenantId, parsed)

  cookieStore.set(ACTIVE_TEMPLATE_COOKIE, parsed.templateId, cookieOptions)
  cookieStore.delete(THEME_DRAFT_COOKIE)

  revalidatePath("/dashboard")
  revalidatePath("/customize")
  revalidatePath("/", "layout")
}
