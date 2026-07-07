import { STATS } from "@/themes/bold/data/mock"

export function ImpactSection() {
  return (
    <section className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p
          className="mb-12 text-center text-[10px] font-bold uppercase tracking-[0.3em]"
          style={{ color: "var(--theme-accent)" }}
        >
          OUR IMPACT
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`px-8 py-12 text-center ${
                index < STATS.length - 1 ? "border-r border-white/10" : ""
              }`}
            >
              <p
                className="text-5xl font-black text-white md:text-6xl"
                style={{ fontFamily: "var(--theme-heading-font)" }}
              >
                {stat.value}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-white/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
