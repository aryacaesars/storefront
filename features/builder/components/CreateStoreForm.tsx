"use client"

import { useActionState } from "react"
import { createStoreAction } from "@/app/(builder)/(dashboard)/stores/new/actions"
import type { CreateStoreState } from "@/app/(builder)/(dashboard)/stores/new/actions"
import { useDashboardActionNotice } from "@/features/builder/hooks/useDashboardActionNotice"

export function CreateStoreForm() {
  const [state, action, pending] = useActionState<CreateStoreState, FormData>(
    createStoreAction,
    undefined,
  )

  useDashboardActionNotice(state)

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          Nama Store
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Toko Sepatu Keren"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-gray-700">
          Slug (subdomain)
        </label>
        <div className="flex items-center gap-2">
          <input
            id="slug"
            name="slug"
            type="text"
            required
            placeholder="toko-sepatu"
            pattern="[a-z0-9][a-z0-9\-]*[a-z0-9]"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
          />
          <span className="shrink-0 whitespace-nowrap text-sm text-gray-400">.etalase.com</span>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Hanya huruf kecil, angka, dan tanda hubung. Contoh: toko-sepatu
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Membuat store..." : "Buat Store"}
      </button>
    </form>
  )
}
