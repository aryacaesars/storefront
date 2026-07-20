"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useMessages } from "@/features/i18n/LocaleProvider"
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
  const t = useMessages().pages
  const router = useRouter()
  const toast = useDashboardToast()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteAction()
      if (result.ok) {
        toast.success(
          t.products.deletedToast.replace("{name}", productName),
          t.common.success,
          () => {
            router.push(`/stores/${storeId}/products`)
          },
        )
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
        {t.products.deleteProduct}
      </button>

      <DashboardAlertDialog
        open={open}
        title={t.products.deleteConfirmTitle}
        description={t.products.deleteConfirmBody}
        confirmLabel={t.common.yesDelete}
        variant="danger"
        loading={pending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
