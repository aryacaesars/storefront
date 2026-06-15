import { Truck, Zap, Leaf } from "lucide-react"

const FEATURES = [
  { Icon: Truck, label: "Fast Global Shipping" },
  { Icon: Zap, label: "Premium Engineering" },
  { Icon: Leaf, label: "Sustainable Choice" },
] as const

export function FeaturesBar() {
  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl divide-x divide-gray-100">
        {FEATURES.map(({ Icon, label }) => (
          <div
            key={label}
            className="flex flex-1 items-center justify-center gap-2.5 py-4"
          >
            <Icon
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: "var(--theme-accent)" }}
              strokeWidth={2}
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
