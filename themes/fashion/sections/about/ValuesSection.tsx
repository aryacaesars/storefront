import { RotateCcw, Scissors, Timer } from "lucide-react"
import { BRAND_VALUES } from "@/themes/fashion/data/mock"

const ICON_MAP = {
  RotateCcw: <RotateCcw className="h-5 w-5 text-[var(--theme-muted)]" strokeWidth={1.5} />,
  Scissors:  <Scissors  className="h-5 w-5 text-[var(--theme-muted)]" strokeWidth={1.5} />,
  Timer:     <Timer     className="h-5 w-5 text-[var(--theme-muted)]" strokeWidth={1.5} />,
} as const

export function ValuesSection() {
  return (
    <section className="bg-stone-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-[var(--theme-muted)]">
            MATERIAL INTEGRITY
          </p>
          <h2
            className="text-3xl font-medium italic text-[var(--theme-text)] md:text-4xl"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            The foundation of every stitch is truth.
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {BRAND_VALUES.map((v) => (
            <div key={v.title} className="px-4 text-center">
              <div className="mb-4 flex justify-center">{ICON_MAP[v.icon]}</div>
              <p className="mb-2 text-sm font-semibold text-[var(--theme-text)]">{v.title}</p>
              <p className="mx-auto max-w-[220px] text-xs leading-relaxed text-[var(--theme-muted)]">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
