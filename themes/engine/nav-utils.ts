import type { TemplateId } from "./schema"
import { getImplementedPages } from "./registry"
import { hrefToPageType } from "./route-map"

const PLATFORM_HREFS = new Set(["/cart", "/checkout"])

/** Hide nav links to theme pages that are not registered for this template. */
export function isNavHrefAvailable(templateId: TemplateId, href: string): boolean {
  if (PLATFORM_HREFS.has(href)) return true

  const pageType = hrefToPageType(href)
  if (!pageType) return true
  if (pageType === "home") return true

  return getImplementedPages(templateId).includes(pageType)
}
