import { notFound, redirect } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getThemeForTenant } from "@/server/services/theme.service"
import { getActiveTemplateId, normalizeThemeSlug } from "@/server/services/template.service"
import { templateIdSchema, type TemplateId } from "@/themes/engine/schema"
import { getDefaultThemeConfig } from "@/lib/themes/defaults"
import { getStorefrontHost } from "@/lib/tenant/storefront-url"
import { TEMPLATE_META } from "@/themes/engine/registry"
import { CustomizeWorkspace } from "@/features/builder/components/CustomizeWorkspace"
import { saveThemeDraftForStore, publishThemeForStore } from "./actions"

export const metadata = { title: "Kustomisasi — Storefront Builder" }

function resolveTemplateId(
  templateParam: string | undefined,
  activeTemplateId: string | null,
): TemplateId {
  const raw = templateParam ?? activeTemplateId ?? "minimalist"
  const normalized = normalizeThemeSlug(raw) ?? templateIdSchema.parse("minimalist")
  return normalized
}

export default async function StoreCustomizePage({
  params,
  searchParams,
}: {
  params: Promise<{ storeId: string }>
  searchParams: Promise<{ template?: string; mode?: string }>
}) {
  const { storeId } = await params
  const { template: templateParam, mode } = await searchParams
  const session = await requireSession()
  const store = await getStoreById(storeId)

  if (!store || store.ownerId !== session.userId) notFound()

  const activeTemplateId = await getActiveTemplateId(storeId)
  if (!activeTemplateId && !templateParam) {
    redirect(`/stores/${storeId}/templates?notice=pick-template`)
  }

  const templateId = resolveTemplateId(templateParam, activeTemplateId)
  const fromDb = await getThemeForTenant(storeId)
  const defaultConfig = {
    ...getDefaultThemeConfig(templateId),
    storeName: store.name,
  }
  const initialConfig =
    fromDb?.config.templateId === templateId
      ? { ...fromDb.config, storeName: store.name }
      : defaultConfig

  const meta = TEMPLATE_META[templateId]
  const storefrontHost = getStorefrontHost(store.slug)

  const saveDraft = saveThemeDraftForStore.bind(null, storeId)
  const publish = publishThemeForStore.bind(null, storeId)

  const initialMode = mode === "preview" ? "preview" : "edit"

  return (
    <CustomizeWorkspace
      storeId={storeId}
      templateId={templateId}
      templateName={meta.name}
      initialConfig={initialConfig}
      storefrontHost={storefrontHost}
      initialMode={initialMode}
      onSaveDraft={saveDraft}
      onPublish={publish}
    />
  )
}
