"use client"

import { useActionState, useState } from "react"
import {
  deleteStoreAction,
  updateStoreSettingsAction,
  type DeleteStoreState,
  type SettingsState,
} from "./actions"
import { useDashboardActionNotice } from "@/features/builder/hooks/useDashboardActionNotice"
import {
  dashboardBtnPrimary,
  dashboardInput,
  dashboardLabel,
} from "@/features/builder/components/dashboard-ui"

export function SettingsForm({
  storeId,
  defaultName,
  defaultSlug,
  defaultPhone,
  defaultEmail,
  defaultAddress,
  rootDomain,
}: {
  storeId: string
  defaultName: string
  defaultSlug: string
  defaultPhone: string
  defaultEmail: string
  defaultAddress: string
  rootDomain: string
}) {
  const action = updateStoreSettingsAction.bind(null, storeId)
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    action,
    undefined,
  )

  useDashboardActionNotice(state, {
    successMessage: "Store settings saved successfully.",
  })

  return (
    <form action={formAction} className="flex w-full flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-dash-ink">Identity</h2>
          <p className="mt-1 text-xs text-dash-muted">
            Store name and subdomain on the platform.
          </p>
        </div>

        <div>
          <label className={dashboardLabel}>Store Name</label>
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
            <span className="inline-flex items-center rounded-r-lg border border-l-0 border-dash-border bg-dash-bg px-3 text-sm text-dash-muted">
              .{rootDomain}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-dash-muted">
            Letters, numbers, and hyphens. Your storefront address will change.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4 border-t border-dash-border pt-8">
        <div>
          <h2 className="text-sm font-semibold text-dash-ink">Contact & address</h2>
          <p className="mt-1 text-xs text-dash-muted">
            Shown in the customer storefront footer.
          </p>
        </div>

        <div>
          <label className={dashboardLabel}>Phone / WhatsApp</label>
          <input
            name="contactPhone"
            type="tel"
            defaultValue={defaultPhone}
            placeholder="08xxxxxxxxxx"
            className={dashboardInput}
          />
        </div>

        <div>
          <label className={dashboardLabel}>Store email</label>
          <input
            name="contactEmail"
            type="email"
            defaultValue={defaultEmail}
            placeholder="hello@toko.com"
            className={dashboardInput}
          />
        </div>

        <div>
          <label className={dashboardLabel}>Address</label>
          <textarea
            name="contactAddress"
            rows={3}
            defaultValue={defaultAddress}
            placeholder="123 Example St, Jakarta"
            className={`${dashboardInput} resize-y`}
          />
        </div>
      </section>

      <button type="submit" disabled={pending} className={dashboardBtnPrimary}>
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  )
}

export function DeleteStorePanel({
  storeId,
  storeName,
}: {
  storeId: string
  storeName: string
}) {
  const [confirmName, setConfirmName] = useState("")
  const action = deleteStoreAction.bind(null, storeId)
  const [state, formAction, pending] = useActionState<DeleteStoreState, FormData>(
    action,
    undefined,
  )

  const canDelete = confirmName.trim() === storeName

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6">
      <h2 className="text-sm font-semibold text-red-700">Delete store</h2>
      <p className="mt-1.5 text-xs leading-relaxed text-red-700/80">
        Deleting this store will remove all products, orders, customers, and theme
        configuration. This action cannot be undone.
      </p>

      <form action={formAction} className="mt-5 flex flex-col gap-3">
        <div>
          <label className={dashboardLabel}>
            Type <span className="font-semibold text-dash-ink">{storeName}</span> to
            confirm
          </label>
          <input
            name="confirmName"
            type="text"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            autoComplete="off"
            className={dashboardInput}
            placeholder={storeName}
          />
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending || !canDelete}
          className="inline-flex cursor-pointer items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Deleting..." : "Permanently delete store"}
        </button>
      </form>
    </div>
  )
}
