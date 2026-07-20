"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { DashboardAlertDialog } from "@/features/builder/components/DashboardAlertDialog"
import { useDashboardToast } from "@/features/builder/components/DashboardToast"
import type { DeleteProductResult } from "@/app/(builder)/(dashboard)/stores/[storeId]/products/[productId]/actions"

interface ProductDeleteButtonProps {
  storeId: string
  productName: string
  deleteAction: () => Promise<DeleteProductResult>
}

export function ProductDeleteButton({
  storeId,
  productName,
  deleteAction,
}: ProductDeleteButtonProps) {
  const router = useRouter()
  const toast = useDashboardToast()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteAction()
      if (result.ok) {
        toast.success(`"${productName}" deleted successfully.`, "Success", () => {
          router.push(`/stores/${storeId}/products`)
        })
        return
      }
      toast.error(result.error)
      setOpen(false)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-red-300 px-5 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
      >
        Delete Product
      </button>

      <DashboardAlertDialog
        open={open}
        title="Delete product?"
        description={
          <>
            Product <strong>{productName}</strong> will be permanently deleted. This action cannot
            be undone.
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
