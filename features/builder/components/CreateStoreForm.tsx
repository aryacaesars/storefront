"use client"

import { useActionState } from "react"
import { createStoreAction } from "@/app/(builder)/(dashboard)/stores/new/actions"
import type { CreateStoreState } from "@/app/(builder)/(dashboard)/stores/new/actions"

export function CreateStoreForm() {
  const [state, action, pending] = useActionState<CreateStoreState, FormData>(
    createStoreAction,
    undefined,
  )

  return (
    <form action={action} className="flex flex-col gap-4">
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {state.error}
        </p>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nama Store
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Toko Sepatu Keren"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
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
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <span className="text-sm text-gray-400 whitespace-nowrap shrink-0">
            .etalase.com
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Hanya huruf kecil, angka, dan tanda hubung. Contoh: toko-sepatu
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? "Membuat store..." : "Buat Store"}
      </button>
    </form>
  )
}
