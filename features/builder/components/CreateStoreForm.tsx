"use client"

import { useActionState, useState } from "react"
import { createStoreAction } from "@/app/(builder)/(dashboard)/stores/new/actions"
import type { CreateStoreState } from "@/app/(builder)/(dashboard)/stores/new/actions"
import { useDashboardActionNotice } from "@/features/builder/hooks/useDashboardActionNotice"
import {
  dashboardBtnPrimary,
  dashboardInput,
  dashboardLabel,
} from "@/features/builder/components/dashboard-ui"
import { useMessages } from "@/features/i18n/LocaleProvider"
import { cn } from "@/lib/utils"

function slugifyPreview(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function CreateStoreForm({ rootDomain }: { rootDomain: string }) {
  const t = useMessages().pages
  const [state, action, pending] = useActionState<CreateStoreState, FormData>(
    createStoreAction,
    undefined,
  )
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)

  useDashboardActionNotice(state)

  function onNameChange(value: string) {
    setName(value)
    if (!slugTouched) setSlug(slugifyPreview(value))
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      {state?.error && (
        <p
          className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600"
          role="alert"
        >
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="name" className={dashboardLabel}>
          {t.createStore.storeName} <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t.createStore.storeNamePlaceholder}
          autoComplete="organization"
          className={dashboardInput}
        />
        <p className="mt-1.5 text-xs text-dash-muted">{t.createStore.storeNameHint}</p>
      </div>

      <div>
        <label htmlFor="slug" className={dashboardLabel}>
          {t.createStore.subdomain} <span className="text-red-500">*</span>
        </label>
        <div className="flex items-stretch">
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true)
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
            }}
            placeholder="cool-shoes"
            pattern="[a-z0-9][a-z0-9\-]*[a-z0-9]|[a-z0-9]"
            autoComplete="off"
            spellCheck={false}
            className={cn(dashboardInput, "rounded-r-none")}
          />
          <span className="inline-flex items-center rounded-r-xl border border-l-0 border-dash-border bg-dash-bg px-3.5 text-sm text-dash-muted">
            .{rootDomain}
          </span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-dash-muted">
          {t.createStore.subdomainHint}
        </p>
        {slug.length >= 2 && (
          <p className="mt-2 truncate rounded-xl bg-dash-bg px-3 py-2 text-xs text-dash-ink">
            <span className="text-dash-muted">{t.createStore.preview} </span>
            <span className="font-medium">
              {slug}.{rootDomain}
            </span>
          </p>
        )}
      </div>

      <div className="border-t border-dash-border pt-6">
        <button
          type="submit"
          disabled={pending}
          className={cn(dashboardBtnPrimary, "w-full sm:w-auto")}
        >
          {pending ? t.createStore.creating : t.createStore.submit}
        </button>
      </div>
    </form>
  )
}
