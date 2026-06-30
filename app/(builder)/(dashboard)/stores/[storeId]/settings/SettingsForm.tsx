"use client"

import { useActionState } from "react"
import { updateStoreSettingsAction } from "./actions"
import type { SettingsState } from "./actions"

export function SettingsForm({
  storeId,
  defaultName,
}: {
  storeId: string
  defaultName: string
}) {
  const action = updateStoreSettingsAction.bind(null, storeId)
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    action,
    undefined,
  )

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state && "error" in state && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{state.error}</p>
      )}
      {state && "success" in state && (
        <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
          Pengaturan berhasil disimpan.
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Store
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={defaultName}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors w-fit"
      >
        {pending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  )
}
