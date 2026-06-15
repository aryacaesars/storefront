import type { MockNewArrival } from "@/themes/bold/data/mock"

interface NewArrivalCardProps {
  product: MockNewArrival
}

const BADGE_STYLE: Record<NonNullable<MockNewArrival["badge"]>, React.CSSProperties> = {
  "NEW ARRIVAL": { backgroundColor: "var(--theme-primary)" },
  "BEST SELLER": { backgroundColor: "var(--theme-accent)", color: "#18181B" },
  "LOW STOCK":   { backgroundColor: "#EF4444" },
}

export function NewArrivalCard({ product }: NewArrivalCardProps) {
  return (
    <div className="group cursor-pointer overflow-hidden border border-gray-100 bg-white transition-shadow hover:shadow-md">
      {/* Image — portrait aspect */}
      <div className={`relative aspect-[4/5] ${product.imageClass}`}>
        {product.badge && (
          <span
            className="absolute left-3 top-3 rounded-sm px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-white"
            style={BADGE_STYLE[product.badge]}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-5 pt-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
          {product.category}
        </p>
        <p
          className="mt-1 text-sm font-black uppercase leading-tight tracking-tight text-zinc-900"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {product.name}
        </p>
        <p className="mt-1.5 text-sm font-bold" style={{ color: "var(--theme-primary)" }}>
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  )
}
