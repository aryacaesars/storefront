import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getThemeConfigForStore } from "@/server/services/theme.service"
import { getActiveTemplateId } from "@/server/services/template.service"
import { templateIdSchema } from "@/themes/engine/schema"
import { getPlatformBaseConfig } from "@/server/services/platform-theme.service"
import { getStorefrontHost } from "@/lib/tenant/storefront-url"
import { TEMPLATE_META } from "@/themes/engine/registry"
import { CustomizeWorkspace } from "@/features/builder/components/CustomizeWorkspace"
import { saveThemeDraftForStore, publishThemeForStore } from "./actions"

export const metadata = { title: "Kustomisasi" }

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
  const savedConfig = await getThemeConfigForStore(storeId, templateId)
  const initialConfig = savedConfig ?? (await getPlatformBaseConfig(templateId))

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
