"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { DashboardAlertDialog } from "@/features/builder/components/DashboardAlertDialog"
import { useDashboardToast } from "@/features/builder/components/DashboardToast"
import type { DeleteCategoryResult } from "@/app/(builder)/(dashboard)/stores/[storeId]/categories/actions"

interface CategoryDeleteButtonProps {
  categoryName: string
  deleteAction: () => Promise<DeleteCategoryResult>
  redirectTo?: string
  variant?: "icon" | "button"
}

export function CategoryDeleteButton({
  categoryName,
  deleteAction,
  redirectTo,
  variant = "icon",
}: CategoryDeleteButtonProps) {
  const router = useRouter()
  const toast = useDashboardToast()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteAction()
      setOpen(false)
      if (result.ok) {
        toast.success(`Category "${categoryName}" deleted successfully.`, "Success", () => {
          if (redirectTo) router.push(redirectTo)
        })
        return
      }
      toast.error(result.error)
    })
  }

  return (
    <>
      {variant === "button" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-red-300 px-5 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          Delete Category
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-1.5 text-gray-400 transition-colors hover:text-red-500"
          title="Delete category"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      <DashboardAlertDialog
        open={open}
        title="Delete category?"
        description={
          <>
            Category <strong>{categoryName}</strong> will be deleted. Products in this category
            will not be deleted.
          </>
        }
        confirmLabel="Yes, delete"
        variant="danger"
        loading={pending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
