import Link from "next/link"

interface ProductsHeaderProps {
  totalCount: number
}

export function ProductsHeader({ totalCount }: ProductsHeaderProps) {
  return (
    <div className="border-b border-gray-100 bg-white px-6 py-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs">
        <Link href="/" className="text-gray-400 transition-colors hover:text-gray-600">
          Home
        </Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-500">All Products</span>
      </div>

      {/* Title row */}
      <div className="mt-3 flex items-end justify-between">
        <div>
          <h1
            className="text-4xl font-black uppercase tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            PERFORMANCE GEAR
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Precision engineered for the high-endurance athlete.
          </p>
        </div>
        <div className="hidden items-center gap-4 sm:flex">
          <span className="text-xs text-zinc-400">{totalCount} Products</span>
          <select className="rounded border border-gray-200 px-3 py-1.5 text-xs text-zinc-600 outline-none focus:border-gray-300">
            <option>Sort by: Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Best Sellers</option>
          </select>
        </div>
      </div>
    </div>
  )
}
