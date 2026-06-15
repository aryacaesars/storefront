import { PILLARS } from "@/themes/bold/data/mock"

export function PillarsSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-px border border-gray-100 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div key={pillar.number} className="bg-white px-8 py-10">
              <p
                className="text-sm font-black uppercase tracking-[0.15em]"
                style={{ color: "var(--theme-text)" }}
              >
                {pillar.number}
              </p>
              <div className="mb-5 mt-4 h-px bg-gray-100" />
              <p className="text-sm leading-relaxed" style={{ color: "var(--theme-muted)" }}>
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
