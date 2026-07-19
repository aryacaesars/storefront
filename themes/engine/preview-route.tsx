import { notFound, redirect } from "next/navigation"
import type { ReactNode } from "react"
import { getPlatformBaseConfig } from "@/server/services/platform-theme.service"
import { templateIdSchema, type TemplateId, type ThemeConfig } from "@/themes/engine/schema"
import { resolveThemePage } from "@/themes/engine/resolve-page"
import type { PageType } from "@/themes/engine/resolve-page"
import { PREVIEW_PAGE_SLUGS } from "@/themes/engine/page-props"
import { BentoPreviewShell } from "@/themes/bento/preview/BentoPreviewShell"
import { BoldPreviewShell } from "@/themes/bold/preview/BoldPreviewShell"
import { MinimalistPreviewShell } from "@/themes/minimalist/preview/MinimalistPreviewShell"
import { FashionPreviewShell } from "@/themes/fashion/preview/FashionPreviewShell"
import { Footer as BoldFooter } from "@/themes/bold"

type PreviewPath = {
  pageType: PageType
  slug?: string
  activeKey?: string
}

const AUTH_SEGMENTS = new Set(["account", "signin", "signup"])

/** Map `/preview/{theme}/…` segments → theme page type. */
export function resolvePreviewPath(segments: string[] | undefined): PreviewPath | null {
  if (!segments || segments.length === 0) {
    return { pageType: "home", activeKey: "home" }
  }

  const [head, ...rest] = segments

  if (AUTH_SEGMENTS.has(head) && rest.length === 0) {
    return { pageType: "home", activeKey: "home" }
  }

  switch (head) {
    case "products":
      if (rest.length === 0) return { pageType: "productList", activeKey: "products" }
      if (rest.length === 1) {
        return { pageType: "productDetail", slug: rest[0], activeKey: "products" }
      }
      return null
    case "categories":
      if (rest.length === 1) {
        return { pageType: "collection", slug: rest[0], activeKey: "products" }
      }
      return null
    case "cart":
      return rest.length === 0 ? { pageType: "cart", activeKey: "cart" } : null
    case "checkout":
      return rest.length === 0 ? { pageType: "checkout", activeKey: "checkout" } : null
    case "about":
      return rest.length === 0 ? { pageType: "about", activeKey: "about" } : null
    case "contact":
      return rest.length === 0 ? { pageType: "contact", activeKey: "contact" } : null
    case "shop":
      return rest.length === 0 ? { pageType: "shop", activeKey: "shop" } : null
    case "collections":
      return rest.length === 0 ? { pageType: "collections", activeKey: "collections" } : null
    case "new-arrivals":
      return rest.length === 0 ? { pageType: "newArrivals", activeKey: "new-arrivals" } : null
    case "all-products":
      // Legacy Bold path — katalog sekarang di /products.
      return rest.length === 0 ? { pageType: "productList", activeKey: "products" } : null
    case "tech-series":
      return rest.length === 0 ? { pageType: "techSeries", activeKey: "tech-series" } : null
    default:
      return null
  }
}

function PreviewShell({
  templateId,
  config,
  activeKey,
  children,
}: {
  templateId: TemplateId
  config: ThemeConfig
  activeKey?: string
  children: ReactNode
}) {
  switch (templateId) {
    case "bento":
      return <BentoPreviewShell config={config}>{children}</BentoPreviewShell>
    case "bold":
      return (
        <BoldPreviewShell
          config={config}
          activeKey={activeKey}
          transparent={activeKey === "home"}
        >
          <main>{children}</main>
          {/* Home tidak menyertakan footer di page component. */}
          {activeKey === "home" && <BoldFooter config={config} />}
        </BoldPreviewShell>
      )
    case "minimalist":
      return (
        <MinimalistPreviewShell config={config}>{children}</MinimalistPreviewShell>
      )
    case "fashion":
      return <FashionPreviewShell config={config}>{children}</FashionPreviewShell>
    default:
      return null
  }
}

export async function renderThemePreviewPage(
  themeParam: string,
  slugSegments: string[] | undefined,
) {
  const parsed = templateIdSchema.safeParse(themeParam)
  if (!parsed.success) notFound()

  const templateId = parsed.data
  const base = `/preview/${templateId}`

  // Auth surfaces tidak di-mock di preview — kembali ke home theme.
  if (slugSegments?.[0] && AUTH_SEGMENTS.has(slugSegments[0]) && slugSegments.length === 1) {
    redirect(base)
  }

  // Bold: about & all-products dihapus — arahkan ke home / products.
  if (templateId === "bold" && slugSegments?.[0] === "about" && slugSegments.length === 1) {
    redirect(base)
  }
  if (
    templateId === "bold" &&
    slugSegments?.[0] === "all-products" &&
    slugSegments.length === 1
  ) {
    redirect(`${base}/products`)
  }

  const path = resolvePreviewPath(slugSegments)
  if (!path) notFound()

  // Fallback page type aliases (fashion shop ≈ productList)
  let pageType = path.pageType
  let Page = resolveThemePage(templateId, pageType)
  if (!Page && pageType === "shop") {
    pageType = "productList"
    Page = resolveThemePage(templateId, pageType)
  }
  if (!Page) notFound()

  const config = await getPlatformBaseConfig(templateId)
  const slug =
    path.slug ??
    (pageType === "productDetail"
      ? PREVIEW_PAGE_SLUGS.productDetail
      : pageType === "collection"
        ? PREVIEW_PAGE_SLUGS.collection
        : undefined)

  return (
    <PreviewShell
      templateId={templateId}
      config={config}
      activeKey={path.activeKey}
    >
      <Page config={config} slug={slug} cart={[]} />
    </PreviewShell>
  )
}

/** Legacy `/preview` → `/preview/minimalist`. */
export function redirectLegacyMinimalistPreview() {
  redirect("/preview/minimalist")
}
