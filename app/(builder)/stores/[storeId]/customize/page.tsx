import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getThemeForTenant } from "@/server/services/theme.service"
import { getActiveTemplateId } from "@/server/services/template.service"
import { templateIdSchema } from "@/themes/engine/schema"
import { getDefaultThemeConfig } from "@/lib/themes/defaults"
import { getStorefrontHost } from "@/lib/tenant/storefront-url"
import { TEMPLATE_META } from "@/themes/engine/registry"
import { CustomizeWorkspace } from "@/features/builder/components/CustomizeWorkspace"
import { saveThemeDraftForStore, publishThemeForStore } from "./actions"

export const metadata = { title: "Kustomisasi — Storefront Builder" }

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

  // Prefer ?template= param, fall back to active template
  const rawTemplateId = templateParam ?? (await getActiveTemplateId(storeId))
  const parsedTemplateId = templateIdSchema.safeParse(rawTemplateId)

  if (!parsedTemplateId.success) {
    redirect(`/stores/${storeId}/templates`)
  }

  const templateId = parsedTemplateId.data
  const fromDb = await getThemeForTenant(storeId)
  const initialConfig =
    fromDb?.config.templateId === templateId
      ? fromDb.config
      : getDefaultThemeConfig(templateId)

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
