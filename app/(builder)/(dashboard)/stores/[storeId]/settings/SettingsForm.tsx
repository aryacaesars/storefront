"use client"

import { useActionState, useState } from "react"
import {
  deleteStoreAction,
  updateStoreSettingsAction,
  type DeleteStoreState,
  type SettingsState,
} from "./actions"
import { useMessages } from "@/features/i18n/LocaleProvider"
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
  const t = useMessages().pages
  const action = updateStoreSettingsAction.bind(null, storeId)
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    action,
    undefined,
  )

  useDashboardActionNotice(state, {
    successMessage: t.settings.savedToast,
  })

  return (
    <form action={formAction} className="flex w-full flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-dash-ink">{t.settings.identity}</h2>
          <p className="mt-1 text-xs text-dash-muted">{t.settings.identityHint}</p>
        </div>

        <div>
          <label className={dashboardLabel}>{t.settings.storeName}</label>
          <input
            name="name"
            type="text"
            required
            defaultValue={defaultName}
            className={dashboardInput}
          />
        </div>

        <div>
          <label className={dashboardLabel}>{t.settings.subdomain}</label>
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
          <p className="mt-1.5 text-xs text-dash-muted">{t.settings.subdomainHint}</p>
        </div>
      </section>

      <section className="flex flex-col gap-4 border-t border-dash-border pt-8">
        <div>
          <h2 className="text-sm font-semibold text-dash-ink">{t.settings.contact}</h2>
          <p className="mt-1 text-xs text-dash-muted">{t.settings.contactHint}</p>
        </div>

        <div>
          <label className={dashboardLabel}>{t.settings.phone}</label>
          <input
            name="contactPhone"
            type="tel"
            defaultValue={defaultPhone}
            placeholder="08xxxxxxxxxx"
            className={dashboardInput}
          />
        </div>

        <div>
          <label className={dashboardLabel}>{t.settings.email}</label>
          <input
            name="contactEmail"
            type="email"
            defaultValue={defaultEmail}
            placeholder="hello@toko.com"
            className={dashboardInput}
          />
        </div>

        <div>
          <label className={dashboardLabel}>{t.settings.address}</label>
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
        {pending ? t.common.saving : t.common.save}
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
  const t = useMessages().pages
  const [confirmName, setConfirmName] = useState("")
  const action = deleteStoreAction.bind(null, storeId)
  const [state, formAction, pending] = useActionState<DeleteStoreState, FormData>(
    action,
    undefined,
  )

  const canDelete = confirmName.trim() === storeName

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6">
      <h2 className="text-sm font-semibold text-red-700">{t.settings.deleteStore}</h2>
      <p className="mt-1.5 text-xs leading-relaxed text-red-700/80">
        {t.settings.deleteWarning}
      </p>

      <form action={formAction} className="mt-5 flex flex-col gap-3">
        <div>
          <label className={dashboardLabel}>
            {t.settings.typeToConfirm.split("{name}")[0]}
            <span className="font-semibold text-dash-ink">{storeName}</span>
            {t.settings.typeToConfirm.split("{name}")[1]}
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
          {pending ? t.settings.deleting : t.settings.permanentlyDelete}
        </button>
      </form>
    </div>
  )
}
