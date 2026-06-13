import { TEAM_MEMBERS_FASHION } from "@/themes/fashion/data/mock"

export function TeamSection() {
  return (
    <section className="bg-[var(--theme-bg)] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[var(--theme-muted)]">
              THE MINDS BEHIND THE SILENCE
            </p>
            <h2
              className="text-3xl font-medium text-[var(--theme-text)]"
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              Curating the Luna vision.
            </h2>
          </div>

          <div className="flex h-9 cursor-pointer items-center bg-[var(--theme-text)] px-5 text-[10px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-zinc-700">
            Join our Atelier
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {TEAM_MEMBERS_FASHION.map((m) => (
            <div key={m.id}>
              <div className={`aspect-[3/4] overflow-hidden ${m.imageClass}`} />
              <div className="mt-3">
                <p className="text-sm font-medium text-[var(--theme-text)]">{m.name}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[var(--theme-muted)]">
                  {m.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
