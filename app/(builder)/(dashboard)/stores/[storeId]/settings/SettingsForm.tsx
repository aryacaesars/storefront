"use client"

import { useActionState } from "react"
import { updateStoreSettingsAction } from "./actions"
import type { SettingsState } from "./actions"
import { useDashboardActionNotice } from "@/features/builder/hooks/useDashboardActionNotice"
import { dashboardBtnPrimary, dashboardInput, dashboardLabel } from "@/features/builder/components/dashboard-ui"

export function SettingsForm({
  storeId,
  defaultName,
  defaultSlug,
  rootDomain,
}: {
  storeId: string
  defaultName: string
  defaultSlug: string
  rootDomain: string
}) {
  const action = updateStoreSettingsAction.bind(null, storeId)
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    action,
    undefined,
  )

  useDashboardActionNotice(state, {
    successMessage: "Pengaturan toko berhasil disimpan.",
  })

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div>
        <label className={dashboardLabel}>Nama Store</label>
        <input
          name="name"
          type="text"
          required
          defaultValue={defaultName}
          className={dashboardInput}
        />
      </div>

      <div>
        <label className={dashboardLabel}>Subdomain</label>
        <div className="flex items-stretch">
          <input
            name="slug"
            type="text"
            required
            defaultValue={defaultSlug}
            pattern="[a-zA-Z0-9\-]+"
            className={`${dashboardInput} rounded-r-none`}
          />
          <span className="inline-flex items-center rounded-r-lg border border-l-0 border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
            .{rootDomain}
          </span>
        </div>
        <p className="mt-1.5 text-xs text-gray-400">
          Huruf, angka, dan tanda hubung. Alamat storefront kamu akan berubah.
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className={dashboardBtnPrimary}
      >
        {pending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  )
}
