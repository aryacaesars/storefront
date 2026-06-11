import { ArrowRight, Package } from "lucide-react"

export function OrderFulfillmentCard() {
  return (
    <div className="bg-[#0e1629] rounded-2xl p-5 flex flex-col gap-4 border border-white/5">
      {/* Label row */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <Package className="w-3.5 h-3.5 text-white/60" />
        </div>
        <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-white/50">
          Order Fulfillment
        </p>
      </div>

      {/* Title + description */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-white leading-tight">
          Operations Engine
        </h3>
        <p className="text-sm text-white/40 leading-relaxed">
          Manage logistics, COD payments, and multi-warehouse stock.
        </p>
      </div>

      {/* CTA button */}
      <a
        href="#"
        className="flex items-center justify-between w-full px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl transition-colors group"
      >
        Open Scalev Dashboard
        <ArrowRight className="w-4 h-4 text-white/60 group-hover:translate-x-0.5 transition-transform" />
      </a>
    </div>
  )
}
