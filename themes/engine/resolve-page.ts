import type { ComponentType } from "react"
import type { TemplateId } from "./schema"
import type { PageType } from "./resolve-page"
import type { ThemePageProps } from "./page-props"
import { templatePages } from "./registry"

export type { PageType } from "./manifest"

type AnyPageComponent = ComponentType<ThemePageProps>

/**
 * Returns the page component for the given template + page type,
 * or null if the theme does not implement that page.
 */
export function resolveThemePage(
  templateId: TemplateId,
  pageType: PageType,
): AnyPageComponent | null {
  const pages = templatePages[templateId] as Record<string, AnyPageComponent> | undefined
  return pages?.[pageType] ?? null
}
