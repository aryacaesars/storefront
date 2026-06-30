"use client"

import { useActionState } from "react"
import { Trash2 } from "lucide-react"
import type { Category } from "@/server/services/product.service"
import { createCategoryAction, deleteCategoryAction } from "./actions"
import type { CategoryState } from "./actions"

export function CategoryPageClient({
  categories,
  storeId,
}: {
  categories: Category[]
  storeId: string
}) {
  const boundAction = createCategoryAction.bind(null, storeId)
  const [state, action, pending] = useActionState<CategoryState, FormData>(
    boundAction,
    undefined,
  )

  return (
    <>
      {categories.length === 0 ? (
        <p className="text-sm text-gray-400 py-2">Belum ada kategori.</p>
      ) : (
        <ul className="divide-y divide-gray-100 mb-4">
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                <p className="text-xs text-gray-400">{cat.slug}</p>
              </div>
              <form action={deleteCategoryAction.bind(null, storeId, cat.id)}>
                <button
                  type="submit"
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  title="Hapus kategori"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form action={action} className="flex gap-2 pt-4 border-t border-gray-100">
        <div className="flex-1">
          {state?.error && (
            <p className="text-xs text-red-600 mb-1">{state.error}</p>
          )}
          <input
            name="name"
            type="text"
            placeholder="Nama kategori baru..."
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {pending ? "..." : "Tambah"}
        </button>
      </form>
    </>
  )
}
