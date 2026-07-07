import { Zap, Wind } from "lucide-react"

export function FeaturesBento() {
  return (
    <div>
      {/* Header */}
      <div className="mb-10 text-center">
        <h2
          className="text-3xl font-black uppercase tracking-tight text-zinc-900"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          ENGINEERED FOR VELOCITY
        </h2>
      </div>

      {/* Bento grid: 3 cols × 2 rows */}
      <div className="grid grid-cols-3 grid-rows-2 gap-3">
        {/* Card A — col 1, row 1 */}
        <div className="rounded-sm bg-gray-100 p-6">
          <Zap className="mb-4 h-5 w-5" style={{ color: "var(--theme-primary)" }} strokeWidth={1.5} />
          <h3 className="text-sm font-black uppercase text-zinc-900">KINETIC-RESPONSE MIDSOLE</h3>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            Dual-density foam construction providing 15% more energy return than industry standards.
            Designed for explosive takeoffs and plush landings.
          </p>
        </div>

        {/* Card B — col 2, row 1 */}
        <div
          className="flex flex-col items-center justify-center rounded-sm p-6 text-center"
          style={{ backgroundColor: "var(--theme-primary)" }}
        >
          <p className="text-4xl font-black text-white">400g</p>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            ULTRA-LIGHTWEIGHT PROFILE
          </p>
        </div>

        {/* Card C — col 3, row 1 */}
        <div className="rounded-sm bg-gray-100 p-6">
          <Wind className="mb-4 h-5 w-5" style={{ color: "var(--theme-primary)" }} strokeWidth={1.5} />
          <h3 className="text-sm font-black uppercase text-zinc-900">AERO-MESH 3.0</h3>
          <p className="mt-2 text-xs text-zinc-500">
            Breathable zonal weaving for optimal thermal regulation.
          </p>
        </div>

        {/* Card D — col 1, row 2 */}
        <div className="flex flex-col justify-end rounded-sm bg-gray-100 p-6">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.15em]"
            style={{ color: "var(--theme-primary)" }}
          >
            GRIP TECH
          </p>
          <h3
            className="mt-1 text-lg font-black uppercase leading-tight text-zinc-900"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            MULTI-SURFACE CARBON RUBBER
          </h3>
        </div>

        {/* Card E — col 2–3, row 2 */}
        <div className="relative col-span-2 overflow-hidden rounded-sm bg-gradient-to-br from-zinc-900 to-black">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <h3
              className="text-xl font-black uppercase text-white"
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              PRECISION ARCHITECTURE
            </h3>
            <p className="mt-1 text-xs text-white/60">
              Every seam, stitch, and layer is optimized for the elite athlete&apos;s stride.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
