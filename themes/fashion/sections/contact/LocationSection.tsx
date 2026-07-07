import { MapPin } from "lucide-react"

export function LocationSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="relative h-[320px] overflow-hidden rounded-sm md:h-[380px]">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 bg-white/90 px-8 py-4 backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-[var(--theme-text)]" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-text)]">
              VISIT LUNA SOFT
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
