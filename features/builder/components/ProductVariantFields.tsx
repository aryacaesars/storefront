"use client"

import { useEffect, useMemo, useState } from "react"
import { ImagePlus, Plus, Trash2, X } from "lucide-react"
import type { ProductVariantInput } from "@/server/services/product-variant"
import { useMessages } from "@/features/i18n/LocaleProvider"
import { useDashboardToast } from "@/features/builder/components/DashboardToast"
import {
  dashboardBtnOutline,
  dashboardInput,
  dashboardLabel,
} from "@/features/builder/components/dashboard-ui"
import { cn } from "@/lib/utils"

export type ProductVariantFormRow = ProductVariantInput & { key: string }

function emptyRow(): ProductVariantFormRow {
  return {
    key: crypto.randomUUID(),
    label: "",
    sku: "",
    size: "",
    color: "",
    price: 0,
    stock: 0,
  }
}

function formatThousands(digits: string): string {
  if (!digits) return ""
  return Number(digits).toLocaleString("id-ID")
}

interface ProductVariantFieldsProps {
  initialVariants?: ProductVariantInput[]
  onVariantsChange?: (variants: ProductVariantInput[]) => void
}

export function ProductVariantFields({
  initialVariants = [],
  onVariantsChange,
}: ProductVariantFieldsProps) {
  const t = useMessages().pages.products
  const [rows, setRows] = useState<ProductVariantFormRow[]>(() =>
    initialVariants.length > 0
      ? initialVariants.map((variant) => ({
          ...variant,
          key: variant.id ?? crypto.randomUUID(),
        }))
      : [],
  )
  const [enabled, setEnabled] = useState(initialVariants.length > 0)

  const serialized = useMemo(
    () =>
      JSON.stringify(
        rows.map(({ key: _key, ...variant }) => ({
          label: variant.label,
          sku: variant.sku || undefined,
          size: variant.size || undefined,
          color: variant.color || undefined,
          price: variant.price,
          stock: variant.stock,
          imageUrl: variant.imageUrl || undefined,
        })),
      ),
    [rows],
  )

  useEffect(() => {
    onVariantsChange?.(
      enabled ? rows.map(({ key: _key, ...variant }) => variant) : [],
    )
  }, [enabled, rows, onVariantsChange])

  function updateRow(key: string, patch: Partial<ProductVariantFormRow>) {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)))
  }

  function addRow() {
    setEnabled(true)
    setRows((prev) => [...prev, emptyRow()])
  }

  function removeRow(key: string) {
    setRows((prev) => {
      const next = prev.filter((row) => row.key !== key)
      if (next.length === 0) setEnabled(false)
      return next
    })
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4">
      <input type="hidden" name="variantsJson" value={enabled ? serialized : "[]"} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{t.variantsTitle}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{t.variantsHint}</p>
        </div>
        <button type="button" onClick={addRow} className={dashboardBtnOutline}>
          <Plus className="h-4 w-4" />
          {t.addVariant}
        </button>
      </div>

      {enabled && rows.length > 0 ? (
        <div className="mt-4 space-y-3">
          {rows.map((row, index) => (
            <div
              key={row.key}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t.variantRow.replace("{n}", String(index + 1))}
                </p>
                <button
                  type="button"
                  onClick={() => removeRow(row.key)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label={t.removeVariant}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={dashboardLabel}>{t.variantLabel}</label>
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => updateRow(row.key, { label: e.target.value })}
                    placeholder={t.variantLabelPlaceholder}
                    className={dashboardInput}
                  />
                </div>
                <div>
                  <label className={dashboardLabel}>{t.variantSize}</label>
                  <input
                    type="text"
                    value={row.size ?? ""}
                    onChange={(e) => updateRow(row.key, { size: e.target.value })}
                    placeholder="S, M, L"
                    className={dashboardInput}
                  />
                </div>
                <div>
                  <label className={dashboardLabel}>{t.variantColor}</label>
                  <input
                    type="text"
                    value={row.color ?? ""}
                    onChange={(e) => updateRow(row.key, { color: e.target.value })}
                    placeholder="Merah, Navy"
                    className={dashboardInput}
                  />
                </div>
                <div>
                  <label className={dashboardLabel}>{t.variantSku}</label>
                  <input
                    type="text"
                    value={row.sku ?? ""}
                    onChange={(e) => updateRow(row.key, { sku: e.target.value })}
                    placeholder="SKU-001"
                    className={dashboardInput}
                  />
                </div>
                <div>
                  <label className={dashboardLabel}>{t.variantPrice}</label>
                  <VariantPriceInput
                    value={row.price}
                    onChange={(price) => updateRow(row.key, { price })}
                  />
                </div>
                <div>
                  <label className={dashboardLabel}>{t.variantStock}</label>
                  <VariantStockInput
                    value={row.stock}
                    onChange={(stock) => updateRow(row.key, { stock })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={dashboardLabel}>{t.variantImage}</label>
                  <VariantImageInput
                    value={row.imageUrl ?? ""}
                    onChange={(url) => updateRow(row.key, { imageUrl: url })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs text-gray-500">{t.variantsEmpty}</p>
      )}
    </div>
  )
}

function VariantImageInput({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const t = useMessages().pages.products
  const toast = useDashboardToast()
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? t.uploadFailed)
      }
      const data = (await res.json()) as { url: string }
      onChange(data.url)
      toast.success(t.imageUploaded)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.uploadFailed)
    } finally {
      setUploading(false)
    }
  }

  if (value) {
    return (
      <div className="group relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt={t.imageAlt} className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
          aria-label={t.removeVariant}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  return (
    <label className="relative flex h-24 w-24 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-center transition-colors hover:border-brand/40 hover:bg-brand/5">
      <ImagePlus className="mb-1 h-5 w-5 text-gray-400" />
      <span className="px-1 text-[10px] font-medium leading-tight text-gray-500">
        {uploading ? t.uploading : t.uploadPhoto}
      </span>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        onChange={handleFile}
        disabled={uploading}
      />
    </label>
  )
}

function VariantStockInput({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  const [digits, setDigits] = useState(value > 0 ? String(value) : "")

  return (
    <input
      type="text"
      inputMode="numeric"
      value={digits}
      onChange={(e) => {
        const next = e.target.value.replace(/\D/g, "")
        setDigits(next)
        onChange(next ? Number(next) : 0)
      }}
      placeholder="0"
      className={dashboardInput}
    />
  )
}

function VariantPriceInput({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  const [digits, setDigits] = useState(value > 0 ? String(value) : "")

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
        Rp
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={formatThousands(digits)}
        onChange={(e) => {
          const next = e.target.value.replace(/\D/g, "")
          setDigits(next)
          onChange(next ? Number(next) : 0)
        }}
        placeholder="0"
        className={cn(dashboardInput, "pl-9")}
      />
    </div>
  )
}
