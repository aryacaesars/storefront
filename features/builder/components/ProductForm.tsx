"use client"

import { useActionState, useCallback, useState } from "react"
import Link from "next/link"
import { ImagePlus, X } from "lucide-react"
import type { Category } from "@/server/services/product.service"
import { useMessages } from "@/features/i18n/LocaleProvider"
import { useDashboardToast } from "@/features/builder/components/DashboardToast"
import { useDashboardActionNotice } from "@/features/builder/hooks/useDashboardActionNotice"
import { DashboardSelect } from "@/features/builder/components/DashboardSelect"
import {
  DashboardPanel,
  dashboardBackLink,
  dashboardBtnPrimary,
  dashboardInput,
  dashboardLabel,
} from "@/features/builder/components/dashboard-ui"
import { ProductVariantFields } from "@/features/builder/components/ProductVariantFields"
import type { ProductVariantInput } from "@/server/services/product-variant"
import { cn } from "@/lib/utils"

export type ProductFormState = { error: string } | { success: true } | undefined

function formatThousands(digits: string): string {
  if (!digits) return ""
  return Number(digits).toLocaleString("id-ID")
}

function priceRangeOf(variants: ProductVariantInput[]): {
  min: number
  max: number
} {
  if (variants.length === 0) return { min: 0, max: 0 }
  const prices = variants.map((v) => Number(v.price) || 0)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

export type ProductFormToast = {
  type: "success" | "error" | "info" | "warning"
  message: string
  title?: string
}

interface ProductFormProps {
  storeId: string
  categories: Category[]
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>
  defaultValues?: {
    name?: string
    description?: string
    price?: number
    stock?: number
    published?: boolean
    categoryId?: string
    imageUrl?: string
    variants?: ProductVariantInput[]
  }
  submitLabel?: string
  initialToast?: ProductFormToast
  extraActions?: React.ReactNode
}

function PublishToggle({
  published,
  onChange,
}: {
  published: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={published}
      onClick={() => onChange(!published)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2",
        published ? "bg-brand" : "bg-gray-200",
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform",
          published ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  )
}

export function ProductForm({
  storeId,
  categories,
  action,
  defaultValues = {},
  submitLabel,
  initialToast,
  extraActions,
}: ProductFormProps) {
  const t = useMessages().pages
  const toast = useDashboardToast()
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(
    action,
    undefined,
  )
  const [priceDigits, setPriceDigits] = useState(
    defaultValues.price != null ? String(defaultValues.price) : "",
  )
  const [imageUrl, setImageUrl] = useState(defaultValues.imageUrl ?? "")
  const [published, setPublished] = useState(defaultValues.published ?? false)
  const [uploading, setUploading] = useState(false)
  const initialVariants = defaultValues.variants ?? []
  const [hasVariants, setHasVariants] = useState(initialVariants.length > 0)
  const [variantStockTotal, setVariantStockTotal] = useState(() =>
    initialVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0),
  )
  const [variantPriceRange, setVariantPriceRange] = useState(() =>
    priceRangeOf(initialVariants),
  )

  const handleVariantsChange = useCallback((variants: ProductVariantInput[]) => {
    setHasVariants(variants.length > 0)
    setVariantStockTotal(
      variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0),
    )
    setVariantPriceRange(priceRangeOf(variants))
  }, [])

  useDashboardActionNotice(state, {
    successMessage: t.products.savedToast,
    initialNotice: initialToast,
  })

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? t.products.uploadFailed)
      }
      const data = (await res.json()) as { url: string }
      setImageUrl(data.url)
      toast.success(t.products.imageUploaded)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.products.uploadFailed)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="published" value={published ? "on" : ""} />
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={`/stores/${storeId}/products`} className={dashboardBackLink}>
          {t.products.backToList}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          {extraActions}
          <button
            type="submit"
            disabled={pending || uploading}
            className={dashboardBtnPrimary}
          >
            {pending ? t.common.saving : (submitLabel ?? t.common.save)}
          </button>
        </div>
      </div>

      <DashboardPanel className="w-full p-6 lg:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-5">
          <div>
            <label className={dashboardLabel}>
              {t.products.name} <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={defaultValues.name}
              placeholder="Black Plain T-Shirt"
              className={dashboardInput}
            />
          </div>

          <div>
            <label className={dashboardLabel}>{t.products.description}</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={defaultValues.description ?? ""}
              placeholder="Product description..."
              className={cn(dashboardInput, "resize-none")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={dashboardLabel}>
                {t.products.price}{" "}
                {!hasVariants && <span className="text-red-500">*</span>}
              </label>
              {hasVariants ? (
                <>
                  <input type="hidden" name="price" value={variantPriceRange.min} />
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      Rp
                    </span>
                    <input
                      type="text"
                      value={
                        variantPriceRange.max > variantPriceRange.min
                          ? `${formatThousands(String(variantPriceRange.min))} – ${formatThousands(String(variantPriceRange.max))}`
                          : formatThousands(String(variantPriceRange.min))
                      }
                      disabled
                      className={cn(dashboardInput, "pl-9 bg-gray-100 text-gray-500")}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {t.products.priceFromVariants}
                  </p>
                </>
              ) : (
                <>
                  <input type="hidden" name="price" value={priceDigits} />
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      Rp
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={formatThousands(priceDigits)}
                      onChange={(e) =>
                        setPriceDigits(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="0"
                      className={cn(dashboardInput, "pl-9")}
                    />
                  </div>
                </>
              )}
            </div>
            <div>
              <label className={dashboardLabel}>
                {t.products.stock}{" "}
                {!hasVariants && <span className="text-red-500">*</span>}
              </label>
              {hasVariants ? (
                <>
                  <input type="hidden" name="stock" value={variantStockTotal} />
                  <input
                    type="number"
                    value={variantStockTotal}
                    disabled
                    className={cn(dashboardInput, "bg-gray-100 text-gray-500")}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t.products.stockFromVariants}
                  </p>
                </>
              ) : (
                <input
                  name="stock"
                  type="number"
                  required
                  min={0}
                  defaultValue={defaultValues.stock ?? ""}
                  className={dashboardInput}
                />
              )}
            </div>
          </div>

          <DashboardSelect
            name="categoryId"
            label={t.products.category}
            defaultValue={defaultValues.categoryId ?? ""}
            placeholder={t.products.noCategory}
            options={[
              { value: "", label: t.products.noCategory },
              ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
            ]}
          />

          <ProductVariantFields
            initialVariants={defaultValues.variants}
            onVariantsChange={handleVariantsChange}
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-lg border border-gray-100 bg-gray-50/80 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink">{t.products.storefrontStatus}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  {published ? t.products.statusActiveHint : t.products.statusDraftHint}
                </p>
              </div>
              <PublishToggle published={published} onChange={setPublished} />
            </div>
            <p
              className={cn(
                "mt-3 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                published ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600",
              )}
            >
              {published ? t.common.active : t.common.draft}
            </p>
          </div>

          <div>
            <label className={dashboardLabel}>{t.products.image}</label>
            {hasVariants && (
              <p className="mb-2 text-xs leading-relaxed text-gray-500">
                {t.products.imageOptionalWithVariants}
              </p>
            )}
            {imageUrl ? (
              <div className="group relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={t.products.imageAlt} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-brand/40 hover:bg-brand/5">
                <ImagePlus className="mb-2 h-8 w-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">{t.products.uploadPhoto}</span>
                <span className="mt-1 text-xs text-gray-400">{t.products.imageFormats}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
              </label>
            )}
            {uploading && <p className="mt-2 text-xs text-gray-500">{t.products.uploading}</p>}
          </div>
        </div>
      </div>
      </DashboardPanel>
    </form>
  )
}
