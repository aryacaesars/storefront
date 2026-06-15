import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
}

const PAGES: (number | "...")[] = [1, 2, 3, "...", 10]

export function Pagination({ currentPage }: PaginationProps) {
  return (
    <div className="mt-12 flex items-center justify-center gap-1">
      {/* Prev */}
      <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-gray-200 text-zinc-400">
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
      </div>

      {/* Pages */}
      {PAGES.map((page, i) => {
        if (page === "...") {
          return (
            <div
              key="ellipsis"
              className="flex h-10 w-10 items-center justify-center text-sm text-zinc-400"
            >
              ...
            </div>
          )
        }
        const isActive = page === currentPage
        return (
          <div
            key={page}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border text-sm transition-colors"
            style={
              isActive
                ? {
                    backgroundColor: "var(--theme-primary)",
                    color: "white",
                    borderColor: "var(--theme-primary)",
                  }
                : { borderColor: "#E5E7EB", color: "#52525B" }
            }
          >
            {page}
          </div>
        )
      })}

      {/* Next */}
      <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-gray-200 text-zinc-400">
        <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
      </div>
    </div>
  )
}
