import "server-only"

import { cache } from "react"
import { cookies } from "next/headers"
import {
  templateIdSchema,
  themeConfigSchema,
  type TemplateId,
  type ThemeConfig,
} from "@/themes/engine/schema"
import { templatePages } from "@/themes/engine/registry"
import { getDefaultThemeConfig } from "@/lib/themes/defaults"
import { getSession } from "@/features/auth/dal"
import {
  getActiveTemplateIdForTenant,
  getThemeForTenant,
} from "@/server/services/theme.service"

const ACTIVE_TEMPLATE_COOKIE = "active-template"
const THEME_DRAFT_COOKIE = "theme-draft"

export const getActiveTemplateId = cache(async (): Promise<TemplateId> => {
  const cookieStore = await cookies()
  const raw = cookieStore.get(ACTIVE_TEMPLATE_COOKIE)?.value
  const fromCookie = templateIdSchema.safeParse(raw)
  if (fromCookie.success) return fromCookie.data

  const session = await getSession()
  if (session) {
    const fromDb = await getActiveTemplateIdForTenant(session.tenantId)
    if (fromDb) return fromDb
  }

  return "minimalist"
})

export const getThemeConfig = cache(async (): Promise<ThemeConfig> => {
  const templateId = await getActiveTemplateId()
  const cookieStore = await cookies()
  const draftRaw = cookieStore.get(THEME_DRAFT_COOKIE)?.value

  if (draftRaw) {
    try {
      const parsed = themeConfigSchema.safeParse(JSON.parse(draftRaw))
      if (parsed.success && parsed.data.templateId === templateId) {
        return parsed.data
      }
    } catch {
      // ignore malformed draft cookie
    }
  }

  const session = await getSession()
  if (session) {
    const fromDb = await getThemeForTenant(session.tenantId)
    if (fromDb?.config.templateId === templateId) {
      return fromDb.config
    }
  }

  return getDefaultThemeConfig(templateId)
})

export function isTemplatePreviewReady(templateId: TemplateId): boolean {
  return templateId in templatePages
}
