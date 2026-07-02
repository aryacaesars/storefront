"use client"

import { useActionState } from "react"
import { createCategoryAction } from "./actions"
import type { CategoryState } from "./actions"
import { useDashboardActionNotice } from "@/features/builder/hooks/useDashboardActionNotice"
import { dashboardBtnPrimary, dashboardInput } from "@/features/builder/components/dashboard-ui"
import { cn } from "@/lib/utils"

export function CategoryAddForm({ storeId }: { storeId: string }) {
  const boundAction = createCategoryAction.bind(null, storeId)
  const [state, action, pending] = useActionState<CategoryState, FormData>(
    boundAction,
    undefined,
  )

  useDashboardActionNotice(state, {
    successMessage: "Kategori berhasil ditambahkan.",
  })

  return (
    <form action={action} className="flex gap-2">
      <input
        name="name"
        type="text"
        placeholder="Nama kategori baru..."
        required
        className={dashboardInput}
      />
      <button
        type="submit"
        disabled={pending}
        className={cn(dashboardBtnPrimary, "shrink-0 px-5")}
      >
        {pending ? "..." : "Tambah"}
      </button>
    </form>
  )
}
