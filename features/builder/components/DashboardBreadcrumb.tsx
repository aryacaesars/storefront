import Link from "next/link"
import { ChevronRight } from "lucide-react"

export type BreadcrumbItem = {
  label: string
  href?: string
}

export function DashboardBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-500 transition-colors hover:text-dash-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-gray-800" : "text-gray-500"}>
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
