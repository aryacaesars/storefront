import { ChevronLeft, ChevronRight } from "lucide-react"

const PAGES = [1, 2, 3, "...", 8] as const

export function Pagination() {
  return (
    <div className="mt-12 border-t border-stone-200 pt-8">
      <div className="flex items-center justify-center gap-1">
        <div className="flex h-8 w-8 cursor-pointer items-center justify-center text-xs text-[var(--theme-muted)] hover:text-[var(--theme-text)]">
          <ChevronLeft className="h-3 w-3" />
        </div>

        {PAGES.map((page, i) =>
          page === "..." ? (
            <div
              key={`ellipsis-${i}`}
              className="flex h-8 w-8 items-center justify-center text-xs text-[var(--theme-muted)]"
            >
              ...
            </div>
          ) : (
            <div
              key={page}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center text-xs ${
                page === 1
                  ? "bg-[var(--theme-text)] text-white"
                  : "text-[var(--theme-muted)] hover:text-[var(--theme-text)]"
              }`}
            >
              {page}
            </div>
          )
        )}

        <div className="flex h-8 w-8 cursor-pointer items-center justify-center text-xs text-[var(--theme-muted)] hover:text-[var(--theme-text)]">
          <ChevronRight className="h-3 w-3" />
        </div>
      </div>
    </div>
  )
}
