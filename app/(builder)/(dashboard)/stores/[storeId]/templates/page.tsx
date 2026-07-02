import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import {
  getPublishedTemplates,
  getPurchasedTemplateIds,
  getActiveTemplateId,
  normalizeThemeSlug,
} from "@/server/services/template.service"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { DashboardPanel } from "@/features/builder/components/dashboard-ui"
import { StoreTemplateCard } from "@/features/builder/components/StoreTemplateCard"
import { DashboardInitialNotice } from "@/features/builder/hooks/useDashboardActionNotice"
import { buyTemplate } from "./actions"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const store = await getStoreById(storeId)
  return { title: store ? `Template — ${store.name}` : "Template" }
}

export default async function TemplatesPage({
  params,
  searchParams,
}: {
  params: Promise<{ storeId: string }>
  searchParams: Promise<{ success?: string }>
}) {
  const { storeId } = await params
  const { success } = await searchParams
  const session = await requireSession()
  const store = await getStoreById(storeId)

  if (!store || store.ownerId !== session.userId) notFound()

  const [templates, purchasedIds, activeTemplateId] = await Promise.all([
    getPublishedTemplates(),
    getPurchasedTemplateIds(storeId),
    getActiveTemplateId(storeId),
  ])

  const activeSlug = activeTemplateId ? normalizeThemeSlug(activeTemplateId) ?? activeTemplateId : null
  const total = templates.length

  return (
    <DashboardShell pageTitle="Template" pageSubtitle={`Total: ${total}`}>
      <DashboardInitialNotice
        notice={
          success === "1"
            ? {
                type: "success",
                message: "Template berhasil diaktifkan di storefront kamu.",
                title: "Berhasil",
              }
            : null
        }
      />

      {total === 0 ? (
        <DashboardPanel className="p-12 text-center">
          <p className="text-sm text-gray-400">Belum ada template yang tersedia.</p>
        </DashboardPanel>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => {
            const themeSlug = normalizeThemeSlug(template.slug)
            const isActive =
              activeSlug !== null &&
              (activeSlug === themeSlug || activeTemplateId === template.slug)

            return (
              <StoreTemplateCard
                key={template.id}
                storeId={storeId}
                template={template}
                isPurchased={purchasedIds.has(template.id)}
                isActive={isActive}
                buyAction={buyTemplate}
              />
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}
