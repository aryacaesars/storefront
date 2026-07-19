"use client"

import { X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BuilderMobileSheetProps {
  open: boolean
  title?: string
  onClose: () => void
  children: React.ReactNode
  /** Extra classes — e.g. bottom offset above contextual bar */
  className?: string
}

/** Slide-up bottom sheet for tool panels on mobile. */
export function BuilderMobileSheet({
  open,
  title,
  onClose,
  children,
  className,
}: BuilderMobileSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Tutup panel"
            className="absolute inset-0 z-30 bg-black/25 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title ?? "Tool panel"}
            className={cn(
              "absolute inset-x-0 bottom-0 z-40 flex max-h-[70vh] flex-col overflow-hidden rounded-t-2xl border border-gray-200 bg-white shadow-2xl md:hidden",
              className,
            )}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36, mass: 0.8 }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="relative flex shrink-0 items-center justify-center border-b border-gray-100 px-4 pb-2.5 pt-3">
              <div className="absolute left-1/2 top-1.5 h-1 w-10 -translate-x-1/2 rounded-full bg-gray-200" />
              <p className="pt-1 text-sm font-semibold text-gray-900">
                {title ?? "Tools"}
              </p>
              <button
                type="button"
                aria-label="Tutup"
                onClick={onClose}
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
