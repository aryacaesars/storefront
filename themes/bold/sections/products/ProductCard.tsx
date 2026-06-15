import type { MockProduct } from "@/themes/bold/data/mock"

interface ProductCardProps {
  product: MockProduct
}

const BADGE_STYLE: Record<NonNullable<MockProduct["badge"]>, React.CSSProperties> = {
  "NEW RELEASE": { backgroundColor: "var(--theme-primary)" },
  "SALE":        { backgroundColor: "#EF4444" },
  "LIMITED":     { backgroundColor: "#18181B" },
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-sm border border-gray-100 bg-white transition-shadow hover:shadow-sm">
      {/* Image */}
      <div className={`relative aspect-square ${product.imageClass}`}>
        {product.badge && (
          <span
            className="absolute left-3 top-3 rounded-sm px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white"
            style={BADGE_STYLE[product.badge]}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
          {product.category}
        </p>
        <p
          className="mt-1 text-base font-black leading-tight text-zinc-900"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {product.name}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-bold" style={{ color: "var(--theme-primary)" }}>
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-zinc-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
