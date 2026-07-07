"use client"

import { useActionState } from "react"
import { useDashboardActionNotice } from "@/features/builder/hooks/useDashboardActionNotice"
import {
  dashboardBtnPrimary,
  dashboardInput,
  dashboardLabel,
} from "@/features/builder/components/dashboard-ui"

export type CategoryFormState = { error: string } | { success: true } | undefined

interface CategoryFormProps {
  action: (prev: CategoryFormState, formData: FormData) => Promise<CategoryFormState>
  defaultValues?: { name?: string; slug?: string }
  submitLabel?: string
  productCount?: number
}

export function CategoryForm({
  action,
  defaultValues = {},
  submitLabel = "Simpan",
  productCount,
}: CategoryFormProps) {
  const [state, formAction, pending] = useActionState<CategoryFormState, FormData>(
    action,
    undefined,
  )

  useDashboardActionNotice(state, {
    successMessage: "Kategori berhasil disimpan.",
  })

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-5">
      <div>
        <label className={dashboardLabel}>
          Nama Kategori <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={defaultValues.name}
          placeholder="Contoh: Sepatu"
          className={dashboardInput}
        />
      </div>

      {defaultValues.slug ? (
        <div>
          <label className={dashboardLabel}>Slug</label>
          <p className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm text-gray-500">
            {defaultValues.slug}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Slug otomatis diperbarui dari nama kategori.
          </p>
        </div>
      ) : null}

      {productCount !== undefined ? (
        <div className="rounded-lg border border-gray-100 bg-gray-50/80 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Produk</p>
          <p className="mt-1 text-sm font-semibold text-ink">
            {productCount} produk menggunakan kategori ini
          </p>
        </div>
      ) : null}

      <button type="submit" disabled={pending} className={dashboardBtnPrimary}>
        {pending ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  )
}
