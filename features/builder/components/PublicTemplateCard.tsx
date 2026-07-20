"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Store } from "lucide-react"
import type { Template } from "@prisma/client"
import { cn } from "@/lib/utils"
import { ThemeHeroThumbnail } from "@/features/builder/components/ThemeHeroThumbnail"
import { TemplateThumbnail } from "@/features/builder/components/TemplateThumbnail"
import {
  dashboardBtnOutline,
  dashboardBtnPrimary,
} from "@/features/builder/components/dashboard-ui"
import type { TemplateId, ThemeConfig } from "@/themes/engine/schema"
import { useMessages } from "@/features/i18n/LocaleProvider"
import type { Messages } from "@/features/i18n/messages"

export type LibraryStoreOption = {
  id: string
  name: string
}

export interface PublicTemplateCardProps {
  template: Template
  themeConfig?: ThemeConfig | null
  themeId: TemplateId | null
  previewHref: string | null
  isLoggedIn: boolean
  stores: LibraryStoreOption[]
  /** storeIds yang sudah punya license PAID untuk template ini */
  ownedStoreIds: string[]
  buyForStoreAction: (storeId: string, templateId: string) => Promise<void>
}

type PickerMode = "buy" | "customize" | null
type CardCopy = Messages["templateCard"]

function ownershipLabel(
  ownedCount: number,
  storeCount: number,
  isFree: boolean,
  t: CardCopy,
): string {
  if (storeCount === 0) return isFree ? t.free : t.notOwned
  if (isFree) {
    if (ownedCount === 0) return t.freeReady
    if (ownedCount >= storeCount) return t.onAllStores
    return t.onSomeStores
      .replace("{owned}", String(ownedCount))
      .replace("{total}", String(storeCount))
  }
  if (ownedCount === 0) return t.notOwned
  if (ownedCount >= storeCount) return t.onAllStores
  return t.onSomeStores
    .replace("{owned}", String(ownedCount))
    .replace("{total}", String(storeCount))
}

/**
 * Kartu library publik — license per toko (Shopify-like) + picker multi-store.
 */
export function PublicTemplateCard({
  template,
  themeConfig,
  themeId,
  previewHref,
  isLoggedIn,
  stores,
  ownedStoreIds,
  buyForStoreAction,
}: PublicTemplateCardProps) {
  const t = useMessages().templateCard
  const router = useRouter()
  const [picker, setPicker] = useState<PickerMode>(null)
  const [pending, startTransition] = useTransition()

  const isFree = template.price === 0
  const priceLabel = isFree ? t.free : `Rp ${template.price.toLocaleString("id-ID")}`

  const ownedSet = useMemo(() => new Set(ownedStoreIds), [ownedStoreIds])
  const ownedCount = ownedStoreIds.length
  const storeCount = stores.length
  const allOwned = storeCount > 0 && ownedCount >= storeCount
  const statusText = ownershipLabel(ownedCount, storeCount, isFree, t)

  const localizedDescriptions = t.descriptions as Record<string, string>
  const description =
    localizedDescriptions[template.slug] ??
    template.description ??
    themeId ??
    template.slug

  const customizePath = (storeId: string) =>
    `/stores/${storeId}/customize?template=${themeId ?? template.slug}`

  function closePicker() {
    if (pending) return
    setPicker(null)
  }

  function handlePrimaryClick() {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    if (storeCount === 0) {
      router.push(`/stores/new?template=${encodeURIComponent(template.id)}`)
      return
    }
    if (storeCount === 1) {
      const store = stores[0]
      if (ownedSet.has(store.id) && !isFree) {
        router.push(`/stores/${store.id}/templates`)
        return
      }
      startTransition(async () => {
        await buyForStoreAction(store.id, template.id)
      })
      return
    }
    setPicker("buy")
  }

  function handleCustomizeClick() {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    if (storeCount === 0) {
      router.push(`/stores/new?template=${encodeURIComponent(template.id)}`)
      return
    }
    if (storeCount === 1) {
      router.push(customizePath(stores[0].id))
      return
    }
    setPicker("customize")
  }

  function onPickStore(storeId: string) {
    if (picker === "customize") {
      setPicker(null)
      router.push(customizePath(storeId))
      return
    }
    if (ownedSet.has(storeId) && !isFree) {
      setPicker(null)
      router.push(`/stores/${storeId}/templates`)
      return
    }
    startTransition(async () => {
      await buyForStoreAction(storeId, template.id)
    })
  }

  const primaryLabel = (() => {
    if (!isLoggedIn) return isFree ? t.activate : `${t.buy} — ${priceLabel}`
    if (storeCount === 0) {
      return isFree ? t.createStoreActivate : `${t.buy} — ${priceLabel}`
    }
    if (allOwned && !isFree) return t.manageInStore
    if (ownedCount > 0 && storeCount > 1 && !isFree) return t.buyForAnother
    if (isFree) return storeCount > 1 ? t.activateInStore : t.activate
    return `${t.buy} — ${priceLabel}`
  })()

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {themeConfig ? (
          <ThemeHeroThumbnail config={themeConfig} className="absolute inset-0 h-full w-full" />
        ) : themeId ? (
          <TemplateThumbnail id={themeId} className="aspect-auto h-full w-full" />
        ) : template.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={template.previewUrl}
            alt={template.name}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            {t.previewUnavailable}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-ink">{template.name}</p>
            <p className="mt-0.5 line-clamp-2 text-sm text-gray-400">{description}</p>
            {isLoggedIn && (
              <p
                className={cn(
                  "mt-2 text-xs font-medium",
                  ownedCount > 0 ? "text-emerald-600" : "text-gray-400",
                )}
              >
                {statusText}
              </p>
            )}
          </div>
          <span className="shrink-0 text-sm font-semibold text-brand">{priceLabel}</span>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={handlePrimaryClick}
            className={cn(dashboardBtnPrimary, "w-full py-3 disabled:opacity-50")}
          >
            {pending ? t.processing : primaryLabel}
          </button>

          <div className="grid grid-cols-2 gap-3">
            {previewHref ? (
              <Link
                href={previewHref}
                target="_blank"
                className={cn(dashboardBtnOutline, "py-2.5")}
              >
                {t.preview}
              </Link>
            ) : (
              <span
                aria-disabled
                className={cn(dashboardBtnOutline, "py-2.5 cursor-not-allowed opacity-40")}
              >
                {t.preview}
              </span>
            )}
            <button
              type="button"
              disabled={pending}
              onClick={handleCustomizeClick}
              className={cn(dashboardBtnOutline, "py-2.5 disabled:opacity-50")}
            >
              {t.customize}
            </button>
          </div>
        </div>
      </div>

      {picker && (
        <StorePickerDialog
          copy={t}
          title={picker === "buy" ? t.pickerBuyTitle : t.pickerCustomizeTitle}
          description={
            picker === "buy"
              ? isFree
                ? t.pickerBuyFreeDesc
                : t.pickerBuyPaidDesc
              : t.pickerCustomizeDesc
          }
          stores={stores}
          ownedStoreIds={ownedSet}
          mode={picker}
          isFree={isFree}
          pending={pending}
          onPick={onPickStore}
          onClose={closePicker}
        />
      )}
    </article>
  )
}

function StorePickerDialog({
  copy,
  title,
  description,
  stores,
  ownedStoreIds,
  mode,
  isFree,
  pending,
  onPick,
  onClose,
}: {
  copy: CardCopy
  title: string
  description: string
  stores: LibraryStoreOption[]
  ownedStoreIds: Set<string>
  mode: "buy" | "customize"
  isFree: boolean
  pending: boolean
  onPick: (storeId: string) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label={copy.close}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="store-picker-title"
        className="relative w-full max-w-md rounded-xl bg-white p-5 shadow-xl ring-1 ring-black/5"
      >
        <h2 id="store-picker-title" className="text-base font-semibold text-ink">
          {title}
        </h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>

        <ul className="mt-4 flex max-h-72 flex-col gap-2 overflow-y-auto">
          {stores.map((store) => {
            const owned = ownedStoreIds.has(store.id)
            const label =
              mode === "customize"
                ? copy.pickerCustomize
                : owned && !isFree
                  ? copy.pickerOpen
                  : isFree
                    ? copy.pickerActivate
                    : copy.pickerBuyStore

            return (
              <li key={store.id}>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => onPick(store.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors",
                    owned
                      ? "border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50"
                      : "border-gray-200 bg-white hover:border-brand/30 hover:bg-brand/5",
                    pending && "opacity-50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                      owned ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500",
                    )}
                  >
                    {owned ? (
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      <Store className="h-4 w-4" strokeWidth={1.75} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {store.name}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {owned ? copy.licenseActive : copy.licenseNone}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-xs font-semibold",
                      owned && !isFree && mode === "buy" ? "text-emerald-700" : "text-brand",
                    )}
                  >
                    {label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          disabled={pending}
          onClick={onClose}
          className="mt-4 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          {copy.back}
        </button>
      </div>
    </div>
  )
}
