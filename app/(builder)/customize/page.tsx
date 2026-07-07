import { requireSession } from "@/features/auth/dal"
import { CustomizeWorkspace } from "@/features/builder/components/CustomizeWorkspace"
import {
  getActiveTemplateId,
  getThemeConfig,
} from "@/features/builder/theme-state"
import { TEMPLATE_META } from "@/themes/engine/registry"
import { templateIdSchema } from "@/themes/engine/schema"
import { getDefaultThemeConfig } from "@/lib/themes/defaults"
import { getStorefrontHost } from "@/lib/tenant/storefront-url"

export const metadata = { title: "Customize — Storefront Builder" }

export default async function CustomizePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; template?: string }>
}) {
  const session = await requireSession()

  const { mode, template } = await searchParams
  const initialMode = mode === "preview" ? "preview" : "edit"

  const activeTemplateId = await getActiveTemplateId()
  const previewTemplateId = template
    ? templateIdSchema.parse(template)
    : activeTemplateId

  const initialConfig =
    previewTemplateId === activeTemplateId
      ? await getThemeConfig()
      : getDefaultThemeConfig(previewTemplateId)

  const meta = TEMPLATE_META[previewTemplateId]
  // @ts-expect-error TODO Sprint 3: use storeId from URL params, session.tenantSlug/tenantId removed
  const storefrontHost = getStorefrontHost(session.tenantSlug)

  return (
    <CustomizeWorkspace
      templateId={previewTemplateId}
      templateName={meta.name}
      initialConfig={initialConfig}
      storefrontHost={storefrontHost}
      initialMode={initialMode}
    />
  )
}
